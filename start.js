const { spawn } = require('child_process')
const path = require('path')

const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm'
const services = [
  { name: 'Client', directory: path.join(__dirname, 'client'), port: 5173 },
  { name: 'Admin', directory: path.join(__dirname, 'admin'), port: 5174 },
]

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
