import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import vm from 'node:vm'

const source = readFileSync(new URL('../src/client.template.js', import.meta.url), 'utf8')
const start = source.indexOf('    function decodeVoice(')
const end = source.indexOf('    function PetView(', start)
const context = vm.createContext({ atob })
vm.runInContext(source.slice(start, end), context)
const clip = Buffer.from([1, 2, 3, 4]).toString('base64')

test('repeated and concurrent playback decodes once without changing samples', async () => {
  const cache = new Map()
  let decodes = 0
  const buffer = { length: 100, numberOfChannels: 2 }
  const ctx = { async decodeAudioData(bytes) {
    decodes++
    assert.deepEqual([...new Uint8Array(bytes)], [1, 2, 3, 4])
    return buffer
  } }
  const first = context.decodeVoice(ctx, cache, 'headpat', clip)
  const second = context.decodeVoice(ctx, cache, 'headpat', clip)
  assert.equal(first, second)
  assert.equal(await first, buffer)
  assert.equal(await context.decodeVoice(ctx, cache, 'headpat', clip), buffer)
  assert.equal(decodes, 1)
})

test('LRU evicts old clips and never retains more than three entries', async () => {
  const cache = new Map()
  const ctx = { async decodeAudioData() { return { length: 100, numberOfChannels: 1 } } }
  for (const key of ['a', 'b', 'c', 'a', 'd']) await context.decodeVoice(ctx, cache, key, clip)
  assert.deepEqual([...cache.keys()], ['c', 'a', 'd'])
})

test('oversized clips play but do not remain cached', async () => {
  const cache = new Map()
  const buffer = { length: 3 * 1024 * 1024, numberOfChannels: 1 }
  assert.equal(await context.decodeVoice({ decodeAudioData: async () => buffer }, cache, 'long', clip), buffer)
  assert.equal(cache.size, 0)
})

test('failed decode can be retried instead of poisoning the cache', async () => {
  const cache = new Map()
  let calls = 0
  const ctx = { async decodeAudioData() {
    if (++calls === 1) throw Error('decode failed')
    return { length: 100, numberOfChannels: 1 }
  } }
  await assert.rejects(context.decodeVoice(ctx, cache, 'a', clip), /decode failed/)
  assert.equal(cache.size, 0)
  await context.decodeVoice(ctx, cache, 'a', clip)
  assert.equal(calls, 2)
})
