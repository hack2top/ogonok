const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

const stateFile = process.env.RESTAURANT_DATA_FILE || path.join(__dirname, 'restaurant-data.json')
const sessionCookie = 'savory-admin-session'
const adminCredentials = {
  username: process.env.ADMIN_USERNAME || 'admin',
  password: process.env.ADMIN_PASSWORD || 'hack2top1mira',
  email: (process.env.ADMIN_EMAIL || 'hzuhra34@gmail.com').toLowerCase(),
  phone: (process.env.ADMIN_PHONE || '+998 50 156 72 43').replace(/\D/g, ''),
}
const adminSessions = new Map()
let state = { orders: [], reservations: [] }

if (fs.existsSync(stateFile)) {
  state = JSON.parse(fs.readFileSync(stateFile, 'utf8'))
  if (!Array.isArray(state.orders) || !Array.isArray(state.reservations)) {
    throw new Error(`Invalid restaurant state file: ${stateFile}`)
  }
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
  const expiresAt = adminSessions.get(token)
  if (!expiresAt || expiresAt <= Date.now()) {
    if (token) adminSessions.delete(token)
    return null
  }
  return token
}

function normalizedPhone(value) {
  return String(value || '').replace(/\D/g, '')
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
      const valid = String(credentials.username || '').trim().toLowerCase() === adminCredentials.username.toLowerCase() &&
        credentials.password === adminCredentials.password &&
        String(credentials.email || '').trim().toLowerCase() === adminCredentials.email &&
        normalizedPhone(credentials.phone) === adminCredentials.phone
      if (!valid) {
        sendJson(response, 401, { error: 'Invalid administrator credentials' })
        return true
      }

      const token = crypto.randomBytes(32).toString('hex')
      adminSessions.set(token, Date.now() + 8 * 60 * 60 * 1000)
      const forwardedProtocol = String(request.headers['x-forwarded-proto'] || '').split(',')[0].trim()
      const secure = process.env.RENDER || forwardedProtocol === 'https' || request.socket.encrypted ? '; Secure' : ''
      response.setHeader('Set-Cookie', `${sessionCookie}=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=28800${secure}`)
      sendJson(response, 200, { authenticated: true })
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
    sendJson(response, 200, { authenticated: Boolean(adminSession) })
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
      if (!adminSession) {
        sendJson(response, 401, { error: 'Administrator authentication required' })
        return true
      }
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
      if (!adminSession) {
        sendJson(response, 401, { error: 'Administrator authentication required' })
        return true
      }
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
