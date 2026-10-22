import assert from 'node:assert/strict'
import test from 'node:test'
import { spawnSync } from 'node:child_process'
import { mkdtemp, readFile, writeFile, readdir, rm, mkdir, realpath } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, dirname } from 'node:path'
import { createHash } from 'node:crypto'
import { processFile, loadTools, validateEntry, parseArchiveListing, createFileToolHandler } from '../src/file-tools.js'
import { apply, inject } from '../index.js'
import { createServer } from 'node:http'

test('archive member names reject traversal, device paths, ADS, and Windows aliases', () => {
  for (const path of ['../escape', 'a/../../escape', '/root', 'C:\\x', '\\\\server\\x',
    'a:stream', 'CON.txt', 'a/NUL', 'a/.. ', 'a./b', 'a\nb', 'a//b']) {
    assert.equal(validateEntry(path), false, path)
  }
  for (const path of ['目录/声音.wav', 'folder\\file.txt', '音 频.mp3']) {
    assert.equal(validateEntry(path), true, path)
  }
})

test('archive listing rejects links and excessive expanded sizes', () => {
  assert.throws(() => parseArchiveListing('----------\nPath = a\nSize = 1\nSymbolic Link = ../../x'), /链接/)
  assert.throws(() => parseArchiveListing('----------\nPath = a\nSize = 99999999999'), /安全上限/)
  assert.throws(() => parseArchiveListing('----------\nPath = ../a\nSize = 1'), /不安全/)
})

test('real conversion, encrypted extraction, collisions, and source preservation', { timeout: 120000 }, async t => {
  const tools = await loadTools()
  const available = spawnSync(tools.ffmpeg, ['-version'], { windowsHide: true })
  const zipAvailable = spawnSync(tools.sevenZip, [], { windowsHide: true })
  if (available.error || zipAvailable.error) { t.skip('FFmpeg or 7-Zip is not installed'); return }
  const directory = await realpath(await mkdtemp(join(tmpdir(), 'wakamo-test-')))
  const hash = async file => createHash('sha256').update(await readFile(file)).digest('hex')
  try {
    const audio = join(directory, '音频 sample.wav')
    const made = spawnSync(tools.ffmpeg, ['-nostdin', '-v', 'error', '-f', 'lavfi',
      '-i', 'sine=frequency=440:duration=0.25', audio], { windowsHide: true })
    assert.equal(made.status, 0, made.stderr?.toString())
    const original = await hash(audio)
    for (const format of ['mp3', 'wav', 'flac', 'm4a', 'ogg', 'opus']) {
      const result = await processFile({ path: audio, format }, { tools })
      assert.equal(dirname(result.output), directory)
      assert.ok((await readFile(result.output)).length > 0)
    }
    const repeat = await processFile({ path: audio }, { tools })
    assert.match(repeat.output, /\(1\)\.mp3$/)
    assert.equal(await hash(audio), original)
    const input = join(directory, 'input')
    await mkdir(input)
    await writeFile(join(input, 'hello.txt'), 'source preserved')
    const clear = join(directory, '无密码.zip')
    assert.equal(spawnSync(tools.sevenZip, ['a', clear, 'hello.txt'], { cwd: input, windowsHide: true }).status, 0)
    const extracted = await processFile({ path: clear }, { tools })
    assert.equal(await readFile(join(extracted.output, 'hello.txt'), 'utf8'), 'source preserved')
    const repeated = await processFile({ path: clear }, { tools })
    assert.notEqual(repeated.output, extracted.output)
    const tar = join(directory, 'nested.tar')
    const tarGz = join(directory, 'nested.tar.gz')
    assert.equal(spawnSync(tools.sevenZip, ['a', '-ttar', tar, 'hello.txt'], { cwd: input, windowsHide: true }).status, 0)
    assert.equal(spawnSync(tools.sevenZip, ['a', '-tgzip', tarGz, tar], { windowsHide: true }).status, 0)
    const expandedTar = await processFile({ path: tarGz }, { tools })
    assert.equal(await readFile(join(expandedTar.output, 'hello.txt'), 'utf8'), 'source preserved')
    const encrypted = join(directory, '加密.7z')
    assert.equal(spawnSync(tools.sevenZip, ['a', '-p测试123', '-mhe=on', encrypted, 'hello.txt'],
      { cwd: input, windowsHide: true }).status, 0)
    for (const password of ['', 'wrong']) {
      await assert.rejects(processFile({ path: encrypted, password }, { tools }),
        error => error.code === 'PASSWORD_REQUIRED')
    }
    const unlocked = await processFile({ path: encrypted, password: '测试123' }, { tools })
    assert.equal(await readFile(join(unlocked.output, 'hello.txt'), 'utf8'), 'source preserved')
    await assert.rejects(processFile({ path: audio }, { tools, signal: AbortSignal.abort() }))
    assert.ok(!(await readdir(directory)).some(name => name.startsWith('.wakamo-')))
  } finally { await rm(directory, { recursive: true, force: true }) }
})

test('Cordis host registers one authenticated file-tools route', () => {
  const routes = []
  const disposers = []
  const connection = { requestRejection: () => 403 }
  apply({
    connection,
    effect(fn) { disposers.push(fn()) },
    webServer: { register(route) { routes.push(route); return () => {} } },
  })
  assert.deepEqual(inject, ['webServer', 'connection'])
  assert.equal(routes.length, 1)
  assert.equal(routes[0].path, '/wakamo/file-tools')
  assert.equal(typeof disposers[0], 'function')
})

test('host route rejects unauthenticated and malformed requests before file access', async () => {
  for (const rejection of [403, undefined]) {
    const handler = createFileToolHandler({ requestRejection: () => rejection })
    const server = createServer(handler)
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
    try {
      const response = await fetch(`http://127.0.0.1:${server.address().port}/`, { method: 'POST' })
      assert.equal(response.status, rejection || 405)
    } finally {
      server.closeAllConnections()
      await new Promise(resolve => server.close(resolve))
    }
  }
})
