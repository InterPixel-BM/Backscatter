import { exec } from 'node:child_process'
import { createReadStream, existsSync, statSync } from 'node:fs'
import { createServer } from 'node:http'
import { extname, join, normalize, resolve } from 'node:path'

const root = resolve(process.argv[2] ?? 'dist')
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.geojson': 'application/geo+json; charset=utf-8',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
}

const server = createServer((request, response) => {
  const path = decodeURIComponent(new URL(request.url ?? '/', 'http://localhost').pathname)
  const file = normalize(join(root, path === '/' ? 'index.html' : path))
  if (!file.startsWith(root) || !existsSync(file) || !statSync(file).isFile()) {
    response.writeHead(404, { 'content-type': 'text/plain' })
    response.end('Not found')
    return
  }
  response.writeHead(200, { 'content-type': types[extname(file).toLowerCase()] ?? 'application/octet-stream' })
  createReadStream(file).pipe(response)
})

const listen = (port) => {
  server.once('error', () => listen(port + 1))
  server.listen(port, '127.0.0.1', () => {
    const address = `http://localhost:${port}/`
    console.log(`Backscatter: ${address}`)
    console.log('Close this window to stop the app.')
    exec(`start "" "${address}"`)
  })
}
listen(4173)
