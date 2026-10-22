import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import vm from 'node:vm'

const source = readFileSync(new URL('../src/client.template.js', import.meta.url), 'utf8')
const manifest = JSON.parse(readFileSync(new URL('../assets/voices/sources.json', import.meta.url), 'utf8').replace(/^\uFEFF/, ''))
const build = readFileSync(new URL('../src/build_assets.py', import.meta.url), 'utf8')
const context = vm.createContext({})
const deckStart = source.indexOf('    function nextReactionIndex(')
vm.runInContext(source.slice(deckStart, source.indexOf('    function clamp(', deckStart)), context)
vm.runInContext(source.slice(source.indexOf('    const NS'), source.indexOf('    const CSS')) +
  '\nglobalThis.lines = {REACTIONS, SIZE_LINE, HEADPAT_LINES, HEADPAT_LONG, MOVE_LINE, IDLE_LINES, ZH, EN}', context)

test('new voice clips have traceable original bytes and matching subtitles', () => {
  assert.equal(manifest.voices.length, 10)
  for (const voice of manifest.voices) {
    const bytes = readFileSync(new URL(`../assets/voices/${voice.key}.ogg`, import.meta.url))
    assert.equal(bytes.subarray(0, 4).toString(), 'OggS', voice.key)
    assert.equal(createHash('sha256').update(bytes).digest('hex').toUpperCase(), voice.sha256)
    assert.equal(context.lines.ZH[`line.${voice.key}`], voice.text, voice.key)
    assert.ok(context.lines.EN[`line.${voice.key}`])
    assert.ok(build.includes(`"${voice.key}",`))
    assert.ok(voice.description.startsWith('CH0175_'))
  }
})

test('all contextual voice references resolve to packaged clips and both locales', () => {
  const lines = context.lines
  const entries = [
    ...lines.REACTIONS, ...lines.IDLE_LINES, ...lines.HEADPAT_LINES,
    lines.HEADPAT_LONG, lines.SIZE_LINE, lines.MOVE_LINE,
  ]
  for (const entry of entries) {
    assert.ok(lines.ZH[entry.key], entry.key)
    assert.ok(lines.EN[entry.key], entry.key)
    const file = readFileSync(new URL(`../assets/voices/${entry.voice}.ogg`, import.meta.url))
    assert.ok(file.length > 0)
  }
})

test('drag voice is rate limited, noninterrupting, and skipped on cancellation', () => {
  const start = source.indexOf('      function endDrag(')
  const end = source.indexOf('\n      function ', start + 1)
  function run({ cancel = false, speaking = false, active = false, last = -Infinity } = {}) {
    let spoken = 0
    let falls = 0
    const ctx = vm.createContext({
      springRef: { current: null }, pettingRef: { current: false },
      dragRef: { current: { id: 1, moved: true } },
      sourceRef: { current: active ? {} : null },
      lastMoveVoice: { current: last }, speaking,
      performance: { now: () => 20000 }, MOVE_LINE: linesMove(),
      setDragging() {}, clearHold() {},
      startPhysics() { falls++ }, showReaction() { spoken++ },
    })
    vm.runInContext(source.slice(start, end), ctx)
    ctx.endDrag({ pointerId: 1 }, cancel)
    assert.equal(falls, 1)
    return spoken
  }
  function linesMove() { return context.lines.MOVE_LINE }
  assert.equal(run(), 1)
  assert.equal(run({ cancel: true }), 0)
  assert.equal(run({ speaking: true }), 0)
  assert.equal(run({ active: true }), 0)
  assert.equal(run({ last: 18000 }), 0)
})

test('each shuffled round contains every click line exactly once without boundary repeats', () => {
  const count = context.lines.REACTIONS.length
  for (const random of [() => 0, () => 0.999999, Math.random]) {
    const deck = { remaining: [], last: -1 }
    let previous = -1
    for (let round = 0; round < 100; round++) {
      const picked = []
      for (let i = 0; i < count; i++) {
        const index = context.nextReactionIndex(deck, count, random)
        assert.notEqual(index, previous)
        picked.push(index)
        previous = index
      }
      assert.equal(new Set(picked).size, count)
      assert.deepEqual(picked.sort((a, b) => a - b), Array.from({ length: count }, (_, i) => i))
    }
  }
})

test('rapid-click annoyed response does not consume the shuffled deck', () => {
  const start = source.indexOf('      function poke(')
  const end = source.indexOf('\n      function ', start + 1)
  const deck = { remaining: [], last: -1 }
  let now = 10000
  const heard = []
  const ctx = vm.createContext({
    Date: { now: () => now },
    pokeLog: { current: { count: 0, last: 0 } },
    reactionDeck: { current: deck },
    REACTIONS: context.lines.REACTIONS, ANNOYED: { voice: 'end' },
    nextReactionIndex: context.nextReactionIndex,
    showReaction: reaction => heard.push(reaction.voice),
    figureRef: { current: null },
  })
  vm.runInContext(source.slice(start, end), ctx)
  for (let i = 0; i < 3; i++) { ctx.poke(); now += 100 }
  const remaining = [...deck.remaining]
  ctx.poke()
  assert.equal(heard.at(-1), 'end')
  assert.deepEqual([...deck.remaining], remaining)
  now += 1700
  ctx.poke()
  assert.notEqual(heard.at(-1), 'end')
  assert.equal(deck.remaining.length, remaining.length - 1)
})
