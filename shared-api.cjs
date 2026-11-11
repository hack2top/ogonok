const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const { DatabaseSync } = require('node:sqlite')

const configuredDataFile = process.env.RESTAURANT_DATA_FILE
const databaseFile = process.env.RESTAURANT_DATABASE_PATH ||
  (configuredDataFile && /\.json$/i.test(configuredDataFile)
    ? configuredDataFile.replace(/\.json$/i, '.sqlite')
    : configuredDataFile) ||
  path.join(__dirname, 'restaurant-data.sqlite')
const sessionCookie = 'savory-admin-session'
const adminCredentials = {
  username: process.env.ADMIN_USERNAME || 'creator',
  password: process.env.ADMIN_PASSWORD || 'hack2top1mira',
}
const employeeRoles = new Set(['chef', 'courier', 'admin', 'analyst'])
const employeeRoleNames = {
  creator: 'Создатель',
  chef: 'Главный шеф',
  courier: 'Курьер',
  admin: 'Админ',
  analyst: 'Аналитик',
}
const adminSessions = new Map()
fs.mkdirSync(path.dirname(databaseFile), { recursive: true })
const database = new DatabaseSync(databaseFile)
database.exec(`
  PRAGMA journal_mode = WAL;
  PRAGMA busy_timeout = 5000;
  CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL DEFAULT '',
    phone TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL,
    data TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS reservations (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL DEFAULT '',
    phone TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL,
    data TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS employees (
    username TEXT PRIMARY KEY COLLATE NOCASE,
    display_name TEXT NOT NULL,
    role TEXT NOT NULL,
    salt TEXT NOT NULL,
    password_hash TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS menu (
    singleton INTEGER PRIMARY KEY CHECK (singleton = 1),
    data TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS orders_contact_idx ON orders(email, phone);
  CREATE INDEX IF NOT EXISTS reservations_contact_idx ON reservations(email, phone);
`)

const statements = {
  getEmployee: database.prepare('SELECT username, display_name AS displayName, role, salt, password_hash AS passwordHash FROM employees WHERE username = ? COLLATE NOCASE'),
  listEmployees: database.prepare('SELECT username, display_name AS displayName, role, salt, password_hash AS passwordHash FROM employees ORDER BY rowid'),
  insertEmployee: database.prepare('INSERT INTO employees (username, display_name, role, salt, password_hash) VALUES (?, ?, ?, ?, ?)'),
  updateEmployee: database.prepare('UPDATE employees SET display_name = ?, role = ?, salt = ?, password_hash = ? WHERE username = ? COLLATE NOCASE'),
  deleteEmployee: database.prepare('DELETE FROM employees WHERE username = ? COLLATE NOCASE'),
  listMenu: database.prepare('SELECT data FROM menu WHERE singleton = 1'),
  saveMenu: database.prepare('INSERT INTO menu (singleton, data) VALUES (1, ?) ON CONFLICT(singleton) DO UPDATE SET data = excluded.data'),
  listOrders: database.prepare('SELECT data FROM orders ORDER BY rowid DESC'),
  listReservations: database.prepare('SELECT data FROM reservations ORDER BY rowid DESC'),
  getOrder: database.prepare('SELECT data FROM orders WHERE id = ?'),
  getReservation: database.prepare('SELECT data FROM reservations WHERE id = ?'),
  insertOrder: database.prepare('INSERT INTO orders (id, email, phone, status, data) VALUES (?, ?, ?, ?, ?)'),
  insertReservation: database.prepare('INSERT INTO reservations (id, email, phone, status, data) VALUES (?, ?, ?, ?, ?)'),
  updateOrderStatus: database.prepare('UPDATE orders SET status = ?, data = ? WHERE id = ?'),
  updateReservationStatus: database.prepare('UPDATE reservations SET status = ?, data = ? WHERE id = ?'),
  customerOrders: database.prepare('SELECT id, status FROM orders WHERE email = ? COLLATE NOCASE AND phone = ?'),
  customerReservations: database.prepare('SELECT id, status FROM reservations WHERE email = ? COLLATE NOCASE AND phone = ?'),
}

const sqliteStorage = {
  getEmployee(username) {
    return statements.getEmployee.get(username)
  },
  listEmployees() {
    return statements.listEmployees.all()
  },
  insertEmployee(employee) {
    statements.insertEmployee.run(employee.username, employee.displayName, employee.role, employee.salt, employee.passwordHash)
  },
  updateEmployee(employee) {
    statements.updateEmployee.run(employee.displayName, employee.role, employee.salt, employee.passwordHash, employee.username)
  },
  deleteEmployee(username) {
    statements.deleteEmployee.run(username)
  },
  getMenu() {
    const row = statements.listMenu.get()
    return row ? JSON.parse(row.data) : []
  },
  saveMenu(menu) {
    statements.saveMenu.run(JSON.stringify(menu))
  },
  listRecords(collection) {
    const rows = collection === 'orders' ? statements.listOrders.all() : statements.listReservations.all()
    return decodeRecords(rows)
  },
  getRecord(collection, id) {
    const row = collection === 'orders' ? statements.getOrder.get(id) : statements.getReservation.get(id)
    return row ? JSON.parse(row.data) : null
  },
  insertRecord(collection, record) {
    saveRecord(collection, record)
  },
  updateRecordStatus(collection, id, status) {
    const record = this.getRecord(collection, id)
    if (!record) return null
    record.status = status
    const update = collection === 'orders' ? statements.updateOrderStatus : statements.updateReservationStatus
    update.run(status, JSON.stringify(record), id)
    return record
  },
  customerStatuses(email, phone) {
    return [
      ...statements.customerOrders.all(email, phone).map(record => ({ ...record, type: 'order' })),
      ...statements.customerReservations.all(email, phone).map(record => ({ ...record, type: 'reservation' })),
    ]
  },
  async close() {
    database.close()
  },
}

function decodeRecords(rows) {
  return rows.map(row => JSON.parse(row.data))
}

function saveRecord(collection, record) {
  const insert = collection === 'orders' ? statements.insertOrder : statements.insertReservation
  insert.run(
    String(record.id),
    String(record.email || '').trim().toLowerCase(),
    normalizedPhone(record.phone),
    String(record.status || (collection === 'orders' ? 'New' : 'Pending')),
    JSON.stringify(record),
  )
}

function migrateLegacyJson() {
  const legacyFiles = new Set([
    configuredDataFile && /\.json$/i.test(configuredDataFile) ? configuredDataFile : null,
    path.join(path.dirname(databaseFile), 'restaurant-data.json'),
    path.join(__dirname, 'restaurant-data.json'),
  ].filter(Boolean))

  const hasData = database.prepare(`
    SELECT
      (SELECT COUNT(*) FROM orders) +
      (SELECT COUNT(*) FROM reservations) +
      (SELECT COUNT(*) FROM employees) +
      (SELECT COUNT(*) FROM menu) AS count
  `).get().count > 0
  if (hasData) return

  const legacyFile = [...legacyFiles].find(file => file !== databaseFile && fs.existsSync(file))
  if (!legacyFile) return

  const legacy = JSON.parse(fs.readFileSync(legacyFile, 'utf8'))
  if (!legacy || !Array.isArray(legacy.orders) || !Array.isArray(legacy.reservations)) {
    throw new Error(`Invalid legacy restaurant data file: ${legacyFile}`)
  }

  database.exec('BEGIN')
  try {
    for (const order of legacy.orders) saveRecord('orders', order)
    for (const reservation of legacy.reservations) saveRecord('reservations', reservation)
    for (const employee of legacy.employees || []) {
      statements.insertEmployee.run(
        employee.username,
        employee.displayName,
        employee.role,
        employee.salt,
        employee.passwordHash,
      )
    }
    if (Array.isArray(legacy.menu) && legacy.menu.length) {
      statements.saveMenu.run(JSON.stringify(legacy.menu))
    }
    database.exec('COMMIT')
  } catch (error) {
    database.exec('ROLLBACK')
    throw error
  }
  console.log(`Migrated restaurant data from ${legacyFile} to SQLite at ${databaseFile}`)
}

migrateLegacyJson()

let storage = sqliteStorage
let mongoClient
let connectionPromise

function isDuplicateError(error) {
  return error.code === 11000 ||
    error.code === 'ERR_SQLITE_CONSTRAINT_PRIMARYKEY' ||
    error.code === 'ERR_SQLITE_CONSTRAINT_UNIQUE'
}

function mongoRecord(document) {
  if (!document) return null
  const { _id, _email, _phone, _createdAt, ...record } = document
  return record
}

function mongoEmployee(document) {
  if (!document) return null
  return {
    username: document.username,
    displayName: document.displayName,
    role: document.role,
    salt: document.salt,
    passwordHash: document.passwordHash,
  }
}

async function migrateSqliteToMongo(collections) {
  const migration = collections.migrations
  if (await migration.findOne({ _id: 'sqlite-import-v1' })) return

  const sqliteOrders = sqliteStorage.listRecords('orders')
  const sqliteReservations = sqliteStorage.listRecords('reservations')
  const sqliteEmployees = sqliteStorage.listEmployees()
  const sqliteMenu = sqliteStorage.getMenu()

  if (sqliteOrders.length) {
    await collections.orders.bulkWrite(sqliteOrders.map(record => ({
      updateOne: {
        filter: { _id: String(record.id) },
        update: { $setOnInsert: { ...record, _id: String(record.id), _email: String(record.email || '').trim().toLowerCase(), _phone: normalizedPhone(record.phone), _createdAt: new Date() } },
        upsert: true,
      },
    })))
  }
  if (sqliteReservations.length) {
    await collections.reservations.bulkWrite(sqliteReservations.map(record => ({
      updateOne: {
        filter: { _id: String(record.id) },
        update: { $setOnInsert: { ...record, _id: String(record.id), _email: String(record.email || '').trim().toLowerCase(), _phone: normalizedPhone(record.phone), _createdAt: new Date() } },
        upsert: true,
      },
    })))
  }
  if (sqliteEmployees.length) {
    await collections.employees.bulkWrite(sqliteEmployees.map(employee => ({
      updateOne: {
        filter: { _id: employee.username.toLowerCase() },
        update: { $setOnInsert: { ...employee, _id: employee.username.toLowerCase() } },
        upsert: true,
      },
    })))
  }
  if (sqliteMenu.length) {
    await collections.menu.updateOne(
      { _id: 'current' },
      { $setOnInsert: { items: sqliteMenu } },
      { upsert: true },
    )
  }

  await migration.updateOne(
    { _id: 'sqlite-import-v1' },
    { $set: { completedAt: new Date() } },
    { upsert: true },
  )
  console.log('Imported existing SQLite data into MongoDB Atlas.')
}

async function connectDatabase() {
  if (!process.env.MONGODB_URI) return
  if (connectionPromise) return connectionPromise

  connectionPromise = (async () => {
    const { MongoClient } = require('mongodb')
    mongoClient = new MongoClient(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
    })
    await mongoClient.connect()
    const mongoDatabase = mongoClient.db(process.env.MONGODB_DB || undefined)
    const collections = {
      orders: mongoDatabase.collection('orders'),
      reservations: mongoDatabase.collection('reservations'),
      employees: mongoDatabase.collection('employees'),
      menu: mongoDatabase.collection('menu'),
      migrations: mongoDatabase.collection('_migrations'),
    }

    await Promise.all([
      collections.orders.createIndex({ _email: 1, _phone: 1 }),
      collections.reservations.createIndex({ _email: 1, _phone: 1 }),
    ])
    await migrateSqliteToMongo(collections)

    storage = {
      async getEmployee(username) {
        return mongoEmployee(await collections.employees.findOne({ _id: String(username).toLowerCase() }))
      },
      async listEmployees() {
        return (await collections.employees.find({}, { projection: { _id: 0 } }).toArray())
          .map(({ username, displayName, role, salt, passwordHash }) => ({ username, displayName, role, salt, passwordHash }))
      },
      async insertEmployee(employee) {
        await collections.employees.insertOne({ ...employee, _id: employee.username.toLowerCase() })
      },
      async updateEmployee(employee) {
        const { username, ...fields } = employee
        await collections.employees.replaceOne({ _id: username.toLowerCase() }, { ...fields, username, _id: username.toLowerCase() })
      },
      async deleteEmployee(username) {
        await collections.employees.deleteOne({ _id: username.toLowerCase() })
      },
      async getMenu() {
        return (await collections.menu.findOne({ _id: 'current' }))?.items || []
      },
      async saveMenu(menu) {
        await collections.menu.updateOne({ _id: 'current' }, { $set: { items: menu } }, { upsert: true })
      },
      async listRecords(collection) {
        return (await collections[collection].find().sort({ _createdAt: -1 }).toArray()).map(mongoRecord)
      },
      async getRecord(collection, id) {
        return mongoRecord(await collections[collection].findOne({ _id: String(id) }))
      },
      async insertRecord(collection, record) {
        await collections[collection].insertOne({
          ...record,
          _id: String(record.id),
          _email: String(record.email || '').trim().toLowerCase(),
          _phone: normalizedPhone(record.phone),
          _createdAt: new Date(),
        })
      },
      async updateRecordStatus(collection, id, status) {
        await collections[collection].updateOne({ _id: String(id) }, { $set: { status } })
        return mongoRecord(await collections[collection].findOne({ _id: String(id) }))
      },
      async customerStatuses(email, phone) {
        const [orders, reservations] = await Promise.all([
          collections.orders.find({ _email: email, _phone: phone }, { projection: { id: 1, status: 1 } }).toArray(),
          collections.reservations.find({ _email: email, _phone: phone }, { projection: { id: 1, status: 1 } }).toArray(),
        ])
        return [
          ...orders.map(({ id, status }) => ({ id, status, type: 'order' })),
          ...reservations.map(({ id, status }) => ({ id, status, type: 'reservation' })),
        ]
      },
      async close() {
        await mongoClient.close()
        await sqliteStorage.close()
      },
    }
    console.log(`Connected to MongoDB database "${mongoDatabase.databaseName}".`)
  })()

  try {
    await connectionPromise
  } catch (error) {
    connectionPromise = null
    if (mongoClient) await mongoClient.close().catch(() => {})
    mongoClient = null
    throw error
  }
}

function sendJson(response, status, value) {
  response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' })
  response.end(JSON.stringify(value))
}

async function getAdminSession(request) {
  const cookie = request.headers.cookie || ''
  const token = cookie.split(';').map(value => value.trim()).find(value => value.startsWith(`${sessionCookie}=`))?.slice(sessionCookie.length + 1)
  const session = adminSessions.get(token)
  if (!session || session.expiresAt <= Date.now()) {
    if (token) adminSessions.delete(token)
    return null
  }
  if (session.role !== 'creator') {
    const employee = await storage.getEmployee(session.username)
    if (!employee) {
      adminSessions.delete(token)
      return null
    }
    session.role = employee.role
    session.displayName = employee.displayName
  }
  return session
}

function normalizedPhone(value) {
  return String(value || '').replace(/\D/g, '')
}

function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  return { salt, passwordHash: crypto.scryptSync(password, salt, 64).toString('hex') }
}

function passwordMatches(password, employee) {
  const supplied = hashPassword(password, employee.salt).passwordHash
  const expectedBuffer = Buffer.from(employee.passwordHash, 'hex')
  const suppliedBuffer = Buffer.from(supplied, 'hex')
  return expectedBuffer.length === suppliedBuffer.length && crypto.timingSafeEqual(expectedBuffer, suppliedBuffer)
}

function hasPermission(session, action) {
  if (!session) return false
  if (session.role === 'creator' || session.role === 'admin') return true
  if (session.role === 'analyst') return action !== 'addEmployees'
  if (session.role === 'chef') return ['viewMenu', 'editMenu', 'viewOrders'].includes(action)
  if (session.role === 'courier') return ['viewOrders', 'editOrders'].includes(action)
  return false
}

function publicEmployee(employee) {
  return {
    username: employee.username,
    displayName: employee.displayName,
    role: employee.role,
    roleName: employeeRoleNames[employee.role],
  }
}

function sessionDetails(session) {
  if (!session) return { authenticated: false }
  return {
    authenticated: true,
    username: session.username,
    displayName: session.displayName || employeeRoleNames[session.role],
    role: session.role,
    roleName: employeeRoleNames[session.role] || 'Сотрудник',
  }
}

function requirePermission(response, session, action) {
  if (hasPermission(session, action)) return true
  sendJson(response, session ? 403 : 401, { error: session ? 'Insufficient permissions' : 'Administrator authentication required' })
  return false
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    let body = ''
    request.setEncoding('utf8')
    request.on('data', chunk => {
      body += chunk
      if (body.length > 1024 * 1024) {
        reject(new Error('Request body is too large'))
        request.destroy()
      }
    })
    request.on('end', () => {
      try {
        resolve(JSON.parse(body || '{}'))
      } catch {
        reject(new Error('Request body must be valid JSON'))
      }
    })
    request.on('error', reject)
  })
}

async function handleApi(request, response, url) {
  const { pathname, searchParams } = url
  try {
    await connectDatabase()
  } catch (error) {
    console.error('Database connection error:', error.message)
    sendJson(response, 503, { error: 'Database is unavailable.' })
    return true
  }
  const adminSession = await getAdminSession(request)

  if (pathname === '/api/admin/login' && request.method === 'POST') {
    try {
      const credentials = await readBody(request)
      const username = String(credentials.username || '').trim().toLowerCase()
      const creatorLogin = username === adminCredentials.username.toLowerCase() && credentials.password === adminCredentials.password
      const employee = await storage.getEmployee(username)
      const employeeLogin = employee && passwordMatches(String(credentials.password || ''), employee)
      if (!creatorLogin && !employeeLogin) {
        sendJson(response, 401, { error: 'Invalid administrator credentials' })
        return true
      }

      const token = crypto.randomBytes(32).toString('hex')
      const session = creatorLogin
        ? { username: adminCredentials.username, role: 'creator', displayName: 'Creator', expiresAt: Date.now() + 8 * 60 * 60 * 1000 }
        : { username: employee.username, role: employee.role, displayName: employee.displayName, expiresAt: Date.now() + 8 * 60 * 60 * 1000 }
      adminSessions.set(token, session)
      const forwardedProtocol = String(request.headers['x-forwarded-proto'] || '').split(',')[0].trim()
      const secure = process.env.RENDER || forwardedProtocol === 'https' || request.socket.encrypted ? '; Secure' : ''
      response.setHeader('Set-Cookie', `${sessionCookie}=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=28800${secure}`)
      sendJson(response, 200, sessionDetails(session))
    } catch (error) {
      console.error('Admin login error:', error.message)
      if (!response.headersSent) sendJson(response, 400, { error: error.message })
    }
    return true
  }

  if (pathname === '/api/admin/session' && request.method === 'DELETE') {
    const cookie = request.headers.cookie || ''
    const token = cookie.split(';').map(value => value.trim()).find(value => value.startsWith(`${sessionCookie}=`))?.slice(sessionCookie.length + 1)
    if (token) adminSessions.delete(token)
    response.setHeader('Set-Cookie', `${sessionCookie}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0`)
    sendJson(response, 200, { authenticated: false })
    return true
  }

  if (pathname === '/api/admin/session' && request.method === 'GET') {
    sendJson(response, 200, sessionDetails(adminSession))
    return true
  }

  if (pathname === '/api/employees') {
    if (request.method === 'GET') {
      if (!requirePermission(response, adminSession, 'viewEmployees')) return true
      sendJson(response, 200, (await storage.listEmployees()).map(publicEmployee))
      return true
    }

    if (request.method === 'POST') {
      if (!requirePermission(response, adminSession, 'addEmployees')) return true
      try {
        const body = await readBody(request)
        const username = String(body.username || '').trim()
        const displayName = String(body.displayName || '').trim()
        const password = String(body.password || '')
        if (!/^[a-zA-Z0-9._-]{3,30}$/.test(username) || username.toLowerCase() === adminCredentials.username.toLowerCase()) {
          sendJson(response, 400, { error: 'Username must be 3-30 letters, numbers, dots, underscores or hyphens.' })
          return true
        }
        if (!displayName || displayName.length > 80 || password.length < 8 || !employeeRoles.has(body.role)) {
          sendJson(response, 400, { error: 'A display name, valid role, and password of at least 8 characters are required.' })
          return true
        }
        const credentials = hashPassword(password)
        const employee = { username, displayName, role: body.role, ...credentials }
        try {
          await storage.insertEmployee(employee)
        } catch (error) {
          if (isDuplicateError(error)) {
            sendJson(response, 409, { error: 'Username already exists.' })
            return true
          }
          throw error
        }
        sendJson(response, 201, publicEmployee(employee))
      } catch (error) {
        console.error('Create employee error:', error.message)
        if (!response.headersSent) sendJson(response, 400, { error: error.message })
      }
      return true
    }

    sendJson(response, 405, { error: 'Method not allowed' })
    return true
  }

  const employeeMatch = pathname.match(/^\/api\/employees\/([^/]+)$/)
  if (employeeMatch) {
    if (!requirePermission(response, adminSession, 'manageEmployees')) return true
    const username = decodeURIComponent(employeeMatch[1])
    const employee = await storage.getEmployee(username)
    if (!employee) {
      sendJson(response, 404, { error: 'Employee not found' })
      return true
    }
    if (request.method === 'PATCH') {
      if (!requirePermission(response, adminSession, 'manageEmployees')) return true
      try {
        const body = await readBody(request)
        if (body.role !== undefined && !employeeRoles.has(body.role)) {
          sendJson(response, 400, { error: 'Invalid employee role.' })
          return true
        }
        if (body.displayName !== undefined && (!String(body.displayName).trim() || String(body.displayName).length > 80)) {
          sendJson(response, 400, { error: 'A valid display name is required.' })
          return true
        }
        if (body.password !== undefined && String(body.password).length < 8) {
          sendJson(response, 400, { error: 'Password must be at least 8 characters.' })
          return true
        }
        if (body.role !== undefined) employee.role = body.role
        if (body.displayName !== undefined) employee.displayName = String(body.displayName).trim()
        if (body.password !== undefined) Object.assign(employee, hashPassword(String(body.password)))
        await storage.updateEmployee(employee)
        sendJson(response, 200, publicEmployee(employee))
      } catch (error) {
        console.error('Update employee error:', error.message)
        if (!response.headersSent) sendJson(response, 400, { error: error.message })
      }
      return true
    }
    if (request.method === 'DELETE') {
      if (adminSession.username === username) {
        sendJson(response, 409, { error: 'You cannot delete the account currently in use.' })
        return true
      }
      await storage.deleteEmployee(employee.username)
      for (const [token, session] of adminSessions) {
        if (session.username === employee.username) adminSessions.delete(token)
      }
      sendJson(response, 200, { deleted: true })
      return true
    }
    sendJson(response, 405, { error: 'Method not allowed' })
    return true
  }

  if (pathname === '/api/menu') {
    if (request.method === 'GET') {
      sendJson(response, 200, await storage.getMenu())
      return true
    }
    if (request.method === 'PUT') {
      if (!requirePermission(response, adminSession, 'editMenu')) return true
      try {
        const menu = await readBody(request)
        if (!Array.isArray(menu)) {
          sendJson(response, 400, { error: 'Menu must be an array.' })
          return true
        }
        await storage.saveMenu(menu)
        sendJson(response, 200, menu)
      } catch (error) {
        console.error('Save menu error:', error.message)
        if (!response.headersSent) sendJson(response, 400, { error: error.message })
      }
      return true
    }
    sendJson(response, 405, { error: 'Method not allowed' })
    return true
  }

  if (pathname === '/api/customer-status' && request.method === 'GET') {
    const email = String(searchParams.get('email') || '').trim().toLowerCase()
    const phone = normalizedPhone(searchParams.get('phone'))
    if (!email || !phone) {
      sendJson(response, 400, { error: 'Email and phone are required' })
      return true
    }
    const customerRecords = await storage.customerStatuses(email, phone)
    sendJson(response, 200, customerRecords)
    return true
  }

  const match = pathname.match(/^\/api\/(orders|reservations)(?:\/([^/]+))?$/)
  if (!match) {
    sendJson(response, 404, { error: 'API route not found' })
    return true
  }

  const [, collection, encodedId] = match

  try {
    if (request.method === 'GET' && !encodedId) {
      const action = collection === 'orders' ? 'viewOrders' : 'viewReservations'
      if (!requirePermission(response, adminSession, action)) return true
      sendJson(response, 200, await storage.listRecords(collection))
      return true
    }

    if (request.method === 'POST' && !encodedId) {
      const record = await readBody(request)
      if (!record || typeof record !== 'object' || record.id === undefined || record.id === null) {
        sendJson(response, 400, { error: 'Record id is required' })
        return true
      }
      const savedRecord = {
        ...record,
        status: adminSession ? record.status : collection === 'orders' ? 'New' : 'Pending',
      }
      try {
        await storage.insertRecord(collection, savedRecord)
      } catch (error) {
        if (isDuplicateError(error)) {
          sendJson(response, 409, { error: 'Record already exists' })
          return true
        }
        throw error
      }
      sendJson(response, 201, savedRecord)
      return true
    }

    if (request.method === 'PATCH' && encodedId) {
      const action = collection === 'orders' ? 'editOrders' : 'editReservations'
      if (!requirePermission(response, adminSession, action)) return true
      const id = decodeURIComponent(encodedId)
      const record = await storage.getRecord(collection, id)
      if (!record) {
        sendJson(response, 404, { error: 'Record not found' })
        return true
      }
      const { status } = await readBody(request)
      if (typeof status !== 'string' || !status.trim()) {
        sendJson(response, 400, { error: 'A non-empty status is required' })
        return true
      }
      const updatedRecord = await storage.updateRecordStatus(collection, id, status)
      if (!updatedRecord) {
        sendJson(response, 404, { error: 'Record not found' })
        return true
      }
      sendJson(response, 200, updatedRecord)
      return true
    }

    sendJson(response, 405, { error: 'Method not allowed' })
  } catch (error) {
    console.error('Shared data API error:', error.message)
    if (!response.headersSent) sendJson(response, 400, { error: error.message })
  }

  return true
}

module.exports = { handleApi, connectDatabase, closeDatabase: () => storage.close() }
