const { spawn } = require('child_process')
const path = require('path')
const http = require('http')
const fs = require('fs')
const { handleApi, connectDatabase } = require('./shared-api.cjs')

const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm'
const services = [
  { name: 'Client', directory: path.join(__dirname, 'client'), port: 5173 },
  { name: 'Admin', directory: path.join(__dirname, 'admin'), port: 5174 },
]

if (process.env.RENDER || process.env.PORT) {
  const port = Number(process.env.PORT || 10000)
  const mimeTypes = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.ico': 'image/x-icon',
  }

  const server = http.createServer((request, response) => {
    const url = new URL(request.url, `http://${request.headers.host || 'localhost'}`)
    if (url.pathname.startsWith('/api/')) {
      handleApi(request, response, url)
      return
    }
    const isAdmin = url.pathname === '/admin' || url.pathname.startsWith('/admin/')
    const root = isAdmin ? path.join(__dirname, 'admin', 'dist') : path.join(__dirname, 'client', 'dist')
    let relativePath = isAdmin ? url.pathname.slice('/admin'.length) : url.pathname
    if (!relativePath || relativePath === '/') relativePath = '/index.html'

    const filePath = path.join(root, relativePath.replace(/^\/+/, ''))
    fs.readFile(filePath, (error, content) => {
      if (!error) {
        const extension = path.extname(filePath).toLowerCase()
        response.setHeader('Content-Type', mimeTypes[extension] || 'application/octet-stream')
        response.end(content)
        return
      }

      const fallback = path.join(root, 'index.html')
      fs.readFile(fallback, (fallbackError, fallbackContent) => {
        if (fallbackError) {
          response.statusCode = 404
          response.end('Not found')
          return
        }

        response.setHeader('Content-Type', 'text/html; charset=utf-8')
        if (isAdmin) {
          response.end(fallbackContent.toString().replaceAll('/assets/', '/admin/assets/'))
        } else {
          response.end(fallbackContent)
        }
      })
    })
  })

  connectDatabase().then(() => {
    server.listen(port, '0.0.0.0', () => {
      console.log(`Restaurant service listening on port ${port}`)
    })
  }).catch((error) => {
    console.error('Could not connect to the configured database:', error.message)
    process.exitCode = 1
  })
} else {
  const apiServer = http.createServer((request, response) => {
    const url = new URL(request.url, `http://${request.headers.host || 'localhost'}`)
    handleApi(request, response, url)
  })
  connectDatabase().then(() => {
    apiServer.listen(5175, '127.0.0.1', () => console.log('Shared data API listening on port 5175'))

    const children = services.map((service) => {
      const child = spawn(npm, ['run', 'dev', '--', '--host', '127.0.0.1', '--port', String(service.port)], {
        cwd: service.directory,
        stdio: 'inherit',
        shell: process.platform === 'win32',
        env: process.env,
      })
      child.on('error', (error) => console.error(`${service.name} failed to start:`, error.message))
      return child
    })

    for (const child of children) {
      child.on('exit', (code, signal) => {
        if (!signal) {
          console.error(`A service stopped with exit code ${code}`)
          process.exitCode = code || 1
        }
      })
    }
  }).catch((error) => {
    console.error('Could not connect to the configured database:', error.message)
    process.exitCode = 1
  })
}
