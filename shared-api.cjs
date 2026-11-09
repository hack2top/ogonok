const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

const stateFile = process.env.RESTAURANT_DATA_FILE || path.join(__dirname, 'restaurant-data.json')
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
let state = { orders: [], reservations: [], employees: [], menu: [] }

if (fs.existsSync(stateFile)) {
  state = JSON.parse(fs.readFileSync(stateFile, 'utf8'))
  if (!Array.isArray(state.orders) || !Array.isArray(state.reservations)) {
    throw new Error(`Invalid restaurant state file: ${stateFile}`)
  }
  state.employees ||= []
  state.menu ||= []
}

function saveState() {
  fs.writeFileSync(stateFile, JSON.stringify(state, null, 2))
}

function sendJson(response, status, value) {
  response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' })
  response.end(JSON.stringify(value))
}

function getAdminSession(request) {
  const cookie = request.headers.cookie || ''
  const token = cookie.split(';').map(value => value.trim()).find(value => value.startsWith(`${sessionCookie}=`))?.slice(sessionCookie.length + 1)
  const session = adminSessions.get(token)
  if (!session || session.expiresAt <= Date.now()) {
    if (token) adminSessions.delete(token)
    return null
  }
  if (session.role !== 'creator') {
    const employee = state.employees.find(item => item.username === session.username)
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
  if (session.role === 'analyst') return action !== 'manageEmployees'
  if (session.role === 'chef') return ['viewMenu', 'editMenu'].includes(action)
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
  const adminSession = getAdminSession(request)

  if (pathname === '/api/admin/login' && request.method === 'POST') {
    try {
      const credentials = await readBody(request)
      const username = String(credentials.username || '').trim().toLowerCase()
      const creatorLogin = username === adminCredentials.username.toLowerCase() && credentials.password === adminCredentials.password
      const employee = state.employees.find(item => item.username.toLowerCase() === username)
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
      sendJson(response, 200, state.employees.map(publicEmployee))
      return true
    }

    if (request.method === 'POST') {
      if (!requirePermission(response, adminSession, 'manageEmployees')) return true
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
        if (state.employees.some(item => item.username.toLowerCase() === username.toLowerCase())) {
          sendJson(response, 409, { error: 'Username already exists.' })
          return true
        }
        const credentials = hashPassword(password)
        const employee = { username, displayName, role: body.role, ...credentials }
        state.employees.push(employee)
        saveState()
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
    const index = state.employees.findIndex(item => item.username === username)
    if (index === -1) {
      sendJson(response, 404, { error: 'Employee not found' })
      return true
    }
    if (request.method === 'PATCH') {
      try {
        const body = await readBody(request)
        const employee = state.employees[index]
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
        saveState()
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
      const [employee] = state.employees.splice(index, 1)
      saveState()
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
      sendJson(response, 200, state.menu)
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
        state.menu = menu
        saveState()
        sendJson(response, 200, state.menu)
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
    const customerRecords = [...state.orders, ...state.reservations]
      .filter(record => String(record.email || '').trim().toLowerCase() === email && normalizedPhone(record.phone) === phone)
      .map(record => ({
        id: record.id,
        status: record.status,
        type: state.orders.includes(record) ? 'order' : 'reservation',
      }))
    sendJson(response, 200, customerRecords)
    return true
  }

  const match = pathname.match(/^\/api\/(orders|reservations)(?:\/([^/]+))?$/)
  if (!match) {
    sendJson(response, 404, { error: 'API route not found' })
    return true
  }

  const [, collection, encodedId] = match
  const records = state[collection]

  try {
    if (request.method === 'GET' && !encodedId) {
      const action = collection === 'orders' ? 'viewOrders' : 'viewReservations'
      if (!requirePermission(response, adminSession, action)) return true
      sendJson(response, 200, records)
      return true
    }

    if (request.method === 'POST' && !encodedId) {
      const record = await readBody(request)
      if (!record || typeof record !== 'object' || record.id === undefined || record.id === null) {
        sendJson(response, 400, { error: 'Record id is required' })
        return true
      }
      if (records.some(item => String(item.id) === String(record.id))) {
        sendJson(response, 409, { error: 'Record already exists' })
        return true
      }
      const savedRecord = {
        ...record,
        status: adminSession ? record.status : collection === 'orders' ? 'New' : 'Pending',
      }
      records.unshift(savedRecord)
      saveState()
      sendJson(response, 201, savedRecord)
      return true
    }

    if (request.method === 'PATCH' && encodedId) {
      const action = collection === 'orders' ? 'editOrders' : 'editReservations'
      if (!requirePermission(response, adminSession, action)) return true
      const id = decodeURIComponent(encodedId)
      const { status } = await readBody(request)
      if (typeof status !== 'string' || !status.trim()) {
        sendJson(response, 400, { error: 'A non-empty status is required' })
        return true
      }
      const record = records.find(item => String(item.id) === id)
      if (!record) {
        sendJson(response, 404, { error: 'Record not found' })
        return true
      }
      record.status = status
      saveState()
      sendJson(response, 200, record)
      return true
    }

    sendJson(response, 405, { error: 'Method not allowed' })
  } catch (error) {
    console.error('Shared data API error:', error.message)
    if (!response.headersSent) sendJson(response, 400, { error: error.message })
  }

  return true
}

module.exports = { handleApi }
