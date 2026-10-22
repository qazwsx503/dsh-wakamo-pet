import { spawn } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import { constants } from 'node:fs'
import { access, copyFile, lstat, mkdir, mkdtemp, readFile, readdir, realpath, rename, rm, statfs } from 'node:fs/promises'
import { dirname, basename, extname, isAbsolute, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('../', import.meta.url))
export const FORMATS = {
  mp3: ['-c:a', 'libmp3lame', '-q:a', '2'],
  wav: ['-c:a', 'pcm_s24le'],
  flac: ['-c:a', 'flac'],
  m4a: ['-c:a', 'aac', '-b:a', '256k'],
  ogg: ['-c:a', 'libvorbis', '-q:a', '5'],
  opus: ['-c:a', 'libopus', '-b:a', '160k'],
}
const ARCHIVES = /\.(zip|7z|rar|tar|tar\.gz|tgz|tar\.bz2|tbz2|tar\.xz|txz|gz|bz2|xz)$/i
const MAX_BYTES = 8 * 1024 ** 3
const MAX_ENTRIES = 20000
const MAX_LOG = 4 * 1024 ** 2

export class FileToolError extends Error {
  constructor(code, message) { super(message); this.code = code }
}

export function isArchive(path) { return ARCHIVES.test(path) }

function command(exe, args, { signal, timeout = 15 * 60 * 1000 } = {}) {
  return new Promise((resolveResult, reject) => {
    if (signal?.aborted) return reject(new FileToolError('CANCELLED', '已取消'))
    const child = spawn(exe, args, { shell: false, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] })
    let stdout = '', stderr = '', bytes = 0, failure
    const stop = (error) => { failure ??= error; child.kill() }
    const cancel = () => stop(new FileToolError('CANCELLED', '已取消'))
    const timer = setTimeout(() => stop(new FileToolError('TIMEOUT', '处理超时，已停止')), timeout)
    signal?.addEventListener('abort', cancel, { once: true })
    for (const [stream, isError] of [[child.stdout, false], [child.stderr, true]]) {
      stream.setEncoding('utf8')
      stream.on('data', chunk => {
        bytes += Buffer.byteLength(chunk)
        if (bytes > MAX_LOG) return stop(new FileToolError('LIMIT', '文件清单过大，已停止'))
        if (isError) stderr += chunk
        else stdout += chunk
      })
    }
    child.on('error', () => {
      failure = new FileToolError('TOOL_MISSING', '处理工具无法启动，请检查 FFmpeg / 7-Zip 安装')
    })
    child.on('close', code => {
      clearTimeout(timer)
      signal?.removeEventListener('abort', cancel)
      if (failure) reject(failure)
      else resolveResult({ code, stdout, stderr })
    })
  })
}

export async function loadTools() {
  let config = {}
  try {
    config = JSON.parse((await readFile(join(ROOT, 'file-tools.local.json'), 'utf8')).replace(/^\uFEFF/, ''))
  } catch (error) {
    if (error.code !== 'ENOENT') throw new FileToolError('CONFIG', '本地工具配置无法读取')
  }
  return {
    ffmpeg: config.ffmpeg || process.env.WAKAMO_FFMPEG || 'ffmpeg',
    sevenZip: config.sevenZip || process.env.WAKAMO_7ZIP ||
      (process.platform === 'win32' ? 'C:\\Program Files\\7-Zip\\7z.exe' : '7z'),
  }
}

async function sourceFile(input) {
  if (typeof input !== 'string' || !isAbsolute(input) || input.includes('\0') ||
    input.startsWith('\\\\') || input.startsWith('//')) {
    throw new FileToolError('PATH', '需要本机文件的完整路径，请从资源管理器拖入')
  }
  const path = await realpath(input)
  const info = await lstat(path)
  if (!info.isFile() || path.startsWith('\\\\') || path.startsWith('//')) {
    throw new FileToolError('PATH', '仅处理本机普通文件，不支持目录或网络路径')
  }
  return path
}

async function freeSpace(path, needed) {
  const info = await statfs(path)
  if (info.bavail * info.bsize < needed + 64 * 1024 ** 2) {
    throw new FileToolError('SPACE', '源文件所在磁盘空间不足')
  }
}

async function unusedPath(parent, name, extension = '') {
  for (let i = 0; i < 10000; i++) {
    const path = join(parent, `${name}${i ? ` (${i})` : ''}${extension}`)
    try { await access(path) } catch (error) {
      if (error.code === 'ENOENT') return path
      throw error
    }
  }
  throw new FileToolError('COLLISION', '同名文件过多')
}

async function convert(path, format, tools, signal) {
  if (!Object.hasOwn(FORMATS, format)) throw new FileToolError('FORMAT', '不支持的输出格式')
  const parent = dirname(path)
  await freeSpace(parent, 64 * 1024 ** 2)
  const staging = await mkdtemp(join(parent, '.wakamo-audio-'))
  try {
    const temp = join(staging, `output.${format}`)
    const result = await command(tools.ffmpeg, [
      '-nostdin', '-hide_banner', '-loglevel', 'error', '-n',
      '-protocol_whitelist', 'file,pipe', '-i', path,
      '-map', '0:a:0', '-vn', ...FORMATS[format], temp,
    ], { signal })
    if (result.code !== 0) {
      throw new FileToolError('AUDIO', '音频无法转换：格式不受支持、文件损坏、受保护或磁盘空间不足')
    }
    const info = await lstat(temp)
    if (!info.size) throw new FileToolError('AUDIO', '转换未产生音频')
    const name = basename(path, extname(path)) + '_converted'
    // COPYFILE_EXCL prevents overwriting even if another app creates the same name.
    for (;;) {
      signal?.throwIfAborted()
      const output = await unusedPath(parent, name, `.${format}`)
      try {
        await copyFile(temp, output, constants.COPYFILE_EXCL)
        return { kind: 'audio', output, format }
      } catch (error) { if (error.code !== 'EEXIST') throw error }
    }
  } finally { await rm(staging, { recursive: true, force: true }) }
}

export function validateEntry(name) {
  if (typeof name !== 'string' || !name || /[\x00-\x1f]/.test(name)) return false
  const normalized = name.replaceAll('\\', '/')
  if (normalized.startsWith('/') || normalized.includes(':')) return false
  return normalized.split('/').every(part =>
    part && part !== '.' && part !== '..' && !/[. ]$/.test(part) &&
    !/[<>"|?*]/.test(part) &&
    !/^(con|prn|aux|nul|com[0-9]|lpt[0-9])(?:\.|$)/i.test(part))
}

export function parseArchiveListing(text) {
  const divider = text.indexOf('----------')
  if (divider < 0) throw new FileToolError('ARCHIVE', '无法读取压缩包清单')
  const blocks = text.slice(divider + 10).trim().split(/\r?\n\r?\n/)
  const entries = blocks.filter(Boolean).map(block => {
    const fields = {}
    for (const line of block.split(/\r?\n/)) {
      const split = line.indexOf(' = ')
      if (split >= 0) fields[line.slice(0, split)] = line.slice(split + 3)
    }
    const name = fields.Path
    if (!validateEntry(name)) throw new FileToolError('UNSAFE_ARCHIVE', '压缩包包含不安全的路径，已拒绝解压')
    if (fields['Symbolic Link'] || fields['Hard Link'] ||
      /(?:^|\s)l[rwx-]{9}/.test(fields.Attributes || '') ||
      /reparse|symlink/i.test(fields.Attributes || '')) {
      throw new FileToolError('UNSAFE_ARCHIVE', '压缩包包含链接，已拒绝解压')
    }
    const size = Number(fields.Size || 0)
    if (!Number.isSafeInteger(size) || size < 0) throw new FileToolError('ARCHIVE', '压缩包大小信息无效')
    return { name, size }
  })
  const total = entries.reduce((sum, entry) => sum + entry.size, 0)
  if (entries.length > MAX_ENTRIES || total > MAX_BYTES) {
    throw new FileToolError('LIMIT', '压缩包超过安全上限（2 万项 / 8 GiB），请使用解压软件处理')
  }
  return { entries, total }
}

function archiveFailure(result, password) {
  if (/password|encrypted|wrong pass/i.test(result.stdout + result.stderr)) {
    throw new FileToolError('PASSWORD_REQUIRED', password ? '密码不正确，请重新输入' : '这个压缩包需要密码')
  }
  throw new FileToolError('ARCHIVE', '解压失败：压缩包损坏、格式不支持、分卷不全或磁盘空间不足')
}

async function inspectTree(parent) {
  let count = 0, total = 0
  async function visit(directory) {
    for (const item of await readdir(directory, { withFileTypes: true })) {
      const path = join(directory, item.name)
      const info = await lstat(path)
      if (info.isSymbolicLink() || (!info.isDirectory() && !info.isFile())) {
        throw new FileToolError('UNSAFE_ARCHIVE', '解压结果包含链接或特殊文件，已停止')
      }
      if (++count > MAX_ENTRIES || (total += info.isFile() ? info.size : 0) > MAX_BYTES) {
        throw new FileToolError('LIMIT', '解压结果超过安全上限')
      }
      if (info.isDirectory()) await visit(path)
    }
  }
  await visit(parent)
}

async function extract(path, password, tools, signal) {
  if (typeof password !== 'string' || password.length > 512 || /[\0\r\n]/.test(password)) {
    throw new FileToolError('PASSWORD', '密码格式无效')
  }
  const parent = dirname(path)
  const args = ['-sccUTF-8', '-bd', '-bb0', `-p${password}`, '--', path]
  const listed = await command(tools.sevenZip, ['l', '-slt', ...args], { signal, timeout: 60000 })
  if (listed.code !== 0) archiveFailure(listed, password)
  const { entries, total } = parseArchiveListing(listed.stdout)
  if (!entries.length) throw new FileToolError('ARCHIVE', '压缩包为空')
  const names = new Set()
  for (const entry of entries) {
    const normalized = entry.name.replaceAll('\\', '/').toLowerCase()
    if (names.has(normalized)) throw new FileToolError('UNSAFE_ARCHIVE', '压缩包包含重名路径，已拒绝解压')
    names.add(normalized)
  }
  await freeSpace(parent, total)
  const staging = await mkdtemp(join(parent, '.wakamo-extract-'))
  try {
    const abort = new AbortController()
    const cancel = () => abort.abort()
    signal?.addEventListener('abort', cancel, { once: true })
    if (signal?.aborted) abort.abort()
    let watching = false, unsafe
    const watcher = setInterval(async () => {
      if (watching) return
      watching = true
      try { await inspectTree(staging) } catch (error) {
        if (error.code !== 'ENOENT') { unsafe = error; abort.abort() }
      } finally { watching = false }
    }, 500)
    let result
    try {
      result = await command(tools.sevenZip,
        ['x', `-o${staging}`, '-y', '-aos', ...args], { signal: abort.signal })
    } catch (error) {
      throw unsafe || error
    } finally {
      clearInterval(watcher)
      signal?.removeEventListener('abort', cancel)
    }
    if (unsafe) throw unsafe
    if (result.code !== 0) archiveFailure(result, password)
    await inspectTree(staging)
    let completed = staging
    if (/\.(tar\.(gz|bz2|xz)|tgz|tbz2|txz)$/i.test(path)) {
      const inner = await readdir(staging)
      if (inner.length !== 1 || !inner[0].toLowerCase().endsWith('.tar')) {
        throw new FileToolError('ARCHIVE', '复合压缩包内容不是单个 TAR 文件')
      }
      const unpacked = await extract(join(staging, inner[0]), password, tools, signal)
      completed = unpacked.output
    }
    signal?.throwIfAborted()
    const stem = basename(path).replace(ARCHIVES, '') || 'archive'
    const output = await unusedPath(parent, stem + '_extracted')
    // Windows rename fails for an existing directory, keeping earlier outputs intact.
    await rename(completed, output)
    return { kind: 'archive', output, files: entries.length }
  } finally { await rm(staging, { recursive: true, force: true }) }
}

export async function processFile(input, { tools, signal } = {}) {
  const path = await sourceFile(input.path)
  const resolved = tools || await loadTools()
  if (isArchive(path)) return extract(path, input.password || '', resolved, signal)
  return convert(path, input.format || 'mp3', resolved, signal)
}

export function createFileToolHandler(connection, options = {}) {
  let busy = false
  const outputs = new Map()
  return async (req, res) => {
    const send = (status, data) => {
      res.statusCode = status
      res.setHeader('Content-Type', 'application/json; charset=utf-8')
      res.setHeader('Cache-Control', 'no-store')
      res.end(JSON.stringify(data))
    }
    const rejection = connection.requestRejection(req)
    if (rejection !== undefined) { res.statusCode = rejection; res.end(); return }
    const address = req.socket?.remoteAddress
    if (address && !['127.0.0.1', '::1', '::ffff:127.0.0.1'].includes(address)) {
      send(403, { code: 'LOCAL_ONLY', message: '仅允许本机操作' }); return
    }
    if (req.method !== 'POST' || req.headers['x-wakamo-action'] !== 'file-tools' ||
      req.headers['content-type']?.split(';')[0] !== 'application/json') {
      send(405, { code: 'REQUEST', message: '无效的文件操作请求' }); return
    }
    if (busy) { send(409, { code: 'BUSY', message: '正在处理另一个文件，请稍后重试' }); return }
    let body = ''
    try {
      for await (const chunk of req) {
        body += chunk
        if (Buffer.byteLength(body) > 16384) throw new FileToolError('REQUEST', '请求过大')
      }
      const input = JSON.parse(body)
      if (!input || typeof input !== 'object') throw new FileToolError('REQUEST', '无效请求')
      if (input.action === 'open') {
        const path = outputs.get(input.id)
        if (!path) throw new FileToolError('PATH', '结果已过期，请手动打开文件夹')
        const folder = (await lstat(path)).isDirectory() ? path : dirname(path)
        await new Promise((resolveOpen, rejectOpen) => {
          const child = spawn(process.env.SystemRoot + '\\explorer.exe', [folder], {
            shell: false, windowsHide: false, detached: true, stdio: 'ignore',
          })
          child.once('error', rejectOpen)
          child.once('spawn', () => { child.unref(); resolveOpen() })
        })
        send(200, { ok: true }); return
      }
      busy = true
      const abort = new AbortController()
      const closed = () => { if (!res.writableEnded) abort.abort() }
      res.once('close', closed)
      try {
        const result = await processFile(input, { ...options, signal: abort.signal })
        const id = randomUUID()
        outputs.set(id, result.output)
        while (outputs.size > 100) outputs.delete(outputs.keys().next().value)
        send(200, { ...result, id })
      } finally {
        res.removeListener('close', closed)
        busy = false
      }
    } catch (error) {
      if (!res.destroyed) send(400, {
        code: error instanceof FileToolError ? error.code : 'FILE',
        message: error instanceof FileToolError ? error.message : '无法处理文件，请检查路径、权限和剩余空间',
      })
    }
  }
}
