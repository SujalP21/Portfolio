/**
 * Build-time utility: renders page 1 of each certificate PDF to a PNG
 * thumbnail so the Certifications grid can show the real document.
 *
 * pdf.js runs inside headless Chrome here and is never shipped to the site.
 * Driven over CDP with real wall-clock waits — Chrome's --virtual-time-budget
 * fires the screenshot before the CDN module graph resolves and yields blanks.
 *
 * Run from the project root:  node scripts/make-cert-thumbs.mjs
 */
import { createServer } from 'node:http'
import { createReadStream } from 'node:fs'
import { stat, mkdir, writeFile } from 'node:fs/promises'
import { spawn } from 'node:child_process'
import { join, extname, resolve } from 'node:path'
import { setTimeout as sleep } from 'node:timers/promises'

const ROOT = resolve(process.cwd())
const PORT = 8899
const DEBUG_PORT = 9355
const CHROME =
  process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'

const OUT_DIR = join(ROOT, 'public', 'proof', 'thumbs')

/** source PDF (relative to public/) -> output thumbnail slug */
const JOBS = [
  ['proof/certs/aws-cloud-practitioner.pdf', 'aws-cloud-practitioner'],
  ['proof/certs/aws-ai-practitioner.pdf', 'aws-ai-practitioner'],
  ['proof/certs/servicenow-csa.pdf', 'servicenow-csa'],
  ['proof/certs/servicenow-cad.pdf', 'servicenow-cad'],
  ['proof/certs/neologicx-experience.pdf', 'neologicx-experience'],
  ['proof/certs/big-code-challenge.pdf', 'big-code-challenge'],
]

const MIME = {
  '.html': 'text/html',
  '.pdf': 'application/pdf',
  '.mjs': 'text/javascript',
  '.js': 'text/javascript',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
}

const server = createServer(async (req, res) => {
  const path = decodeURIComponent(req.url.split('?')[0])
  const filePath = join(ROOT, path)
  try {
    const info = await stat(filePath)
    if (!info.isFile()) throw new Error('not a file')
    res.writeHead(200, {
      'Content-Type': MIME[extname(filePath).toLowerCase()] || 'application/octet-stream',
      'Access-Control-Allow-Origin': '*',
    })
    createReadStream(filePath).pipe(res)
  } catch {
    res.writeHead(404).end('not found')
  }
})
await new Promise((r) => server.listen(PORT, r))
await mkdir(OUT_DIR, { recursive: true })

const chrome = spawn(
  CHROME,
  [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--hide-scrollbars',
    '--force-device-scale-factor=1',
    `--remote-debugging-port=${DEBUG_PORT}`,
    `--user-data-dir=${process.env.TEMP}\\cert-thumbs`,
    '--window-size=1200,850',
    'about:blank',
  ],
  { stdio: 'ignore' },
)

let target
for (let i = 0; i < 40; i++) {
  await sleep(300)
  try {
    const list = await (await fetch(`http://127.0.0.1:${DEBUG_PORT}/json`)).json()
    target = list.find((t) => t.type === 'page' && t.webSocketDebuggerUrl)
    if (target) break
  } catch {}
}
if (!target) {
  console.error('could not attach to Chrome')
  server.close()
  chrome.kill()
  process.exit(1)
}

const ws = new WebSocket(target.webSocketDebuggerUrl)
await new Promise((r) => ws.addEventListener('open', r, { once: true }))

let id = 0
const pending = new Map()
ws.addEventListener('message', (ev) => {
  const msg = JSON.parse(ev.data)
  if (msg.id && pending.has(msg.id)) {
    pending.get(msg.id)(msg)
    pending.delete(msg.id)
  }
})
const send = (method, params = {}) =>
  new Promise((resolve) => {
    const msgId = ++id
    pending.set(msgId, resolve)
    ws.send(JSON.stringify({ id: msgId, method, params }))
  })

// The OS window is larger than the viewport it hosts, so --window-size alone
// leaves the capture short and clips the bottom of each certificate. Pin the
// viewport to the exact thumbnail box instead.
await send('Emulation.setDeviceMetricsOverride', {
  width: 1200,
  height: 850,
  deviceScaleFactor: 1,
  mobile: false,
})

const results = []

for (const [source, slug] of JOBS) {
  try {
    await stat(join(ROOT, 'public', source))
  } catch {
    results.push(`${slug.padEnd(24)} SKIPPED (no source pdf)`)
    continue
  }

  const pdfUrl = encodeURIComponent(`http://localhost:${PORT}/public/${source}`)
  await send('Page.navigate', {
    url: `http://localhost:${PORT}/scripts/pdf-thumb.html?file=${pdfUrl}`,
  })

  // Poll the page's own status flag rather than guessing at a fixed delay.
  let status = 'pending'
  for (let i = 0; i < 40; i++) {
    await sleep(250)
    const res = await send('Runtime.evaluate', {
      expression: 'document.title',
      returnByValue: true,
    })
    status = res.result?.result?.value ?? 'pending'
    if (status !== 'pending') break
  }

  if (status !== 'ok') {
    results.push(`${slug.padEnd(24)} FAILED (${status})`)
    continue
  }

  const shot = await send('Page.captureScreenshot', { format: 'png' })
  const data = shot.result?.data
  if (!data) {
    results.push(`${slug.padEnd(24)} FAILED (no screenshot)`)
    continue
  }

  const outFile = join(OUT_DIR, `${slug}.png`)
  await writeFile(outFile, Buffer.from(data, 'base64'))
  const info = await stat(outFile)
  results.push(`${slug.padEnd(24)} OK  ${(info.size / 1024).toFixed(1)} KB`)
}

ws.close()
chrome.kill()
server.close()

console.log(results.join('\n'))
