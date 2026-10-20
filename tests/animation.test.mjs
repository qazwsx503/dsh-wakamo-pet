import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import vm from 'node:vm'

const source = readFileSync(new URL('../src/client.template.js', import.meta.url), 'utf8')

function extract(name) {
  const start = source.indexOf(`      function ${name}(`)
  assert.notEqual(start, -1)
  const end = source.indexOf('\n      function ', start + 1)
  return source.slice(start, end)
}

function physics() {
  const state = {
    x: 100, y: 100, startX: 100, startY: 100,
    vx: 600, vy: 0, last: 0, bounces: 0,
  }
  let settled = false
  const root = { style: {} }
  const context = vm.createContext({
    physicsRef: { current: state },
    rootRef: { current: root },
    sizeRef: { current: 520 },
    ASPECT: 2179 / 2860,
    window: { innerWidth: 1600, innerHeight: 1200 },
    requestAnimationFrame: () => 1,
    squashLanding() {},
    playThud() {},
    settlePhysics() { settled = true },
  })
  vm.runInContext(extract('stepPhysics'), context)
  return { state, root, step: context.stepPhysics, settled: () => settled }
}

test('free fall and horizontal damping agree at 30, 60 and 144 Hz', () => {
  const results = [30, 60, 144].map((hz) => {
    const run = physics()
    for (let i = 1; i <= hz / 2; i++) run.step(i * 1000 / hz)
    return run.state
  })
  for (const state of results) {
    assert.ok(Math.abs(state.y - 500) < 0.001)
    assert.ok(Math.abs(state.vy - 1600) < 0.001)
    assert.ok(Math.abs(state.vx - results[0].vx) < 0.001)
    assert.ok(Math.abs(state.x - results[0].x) < 1)
  }
})

test('an 80 ms rendering stall does not discard motion time', () => {
  const run = physics()
  run.step(80)
  assert.ok(Math.abs(run.state.y - 110.24) < 0.001)
  assert.ok(Math.abs(run.state.vy - 256) < 0.001)
  assert.match(run.root.style.transform, /^translate3d/)
})

test('floor and edge collisions settle at multiple frame rates', () => {
  for (const hz of [30, 60, 144]) {
    const run = physics()
    run.state.vx = 1800
    for (let i = 1; i <= hz * 8 && !run.settled(); i++) {
      run.step(i * 1000 / hz)
      assert.ok(run.state.x >= 0 && run.state.x <= 1204)
      assert.ok(run.state.y >= 8 && run.state.y <= 672)
    }
    assert.equal(run.settled(), true, `${hz} Hz did not settle`)
    assert.equal(run.state.y, 672)
  }
})

function spring() {
  const pending = new Map()
  const timers = new Map()
  const stack = { style: {}, getAnimations: () => [], animate() {} }
  const context = vm.createContext({
    springRef: { current: { pointerId: 1, startY: 0, pull: 0, raf: 0 } },
    stackRef: { current: stack },
    rootRef: { current: null },
    jumpingRef: { current: false },
    size: 520,
    clamp: (value, min, max) => Math.min(max, Math.max(min, value)),
    requestAnimationFrame(fn) { pending.set(1, fn); return 1 },
    cancelAnimationFrame(id) { pending.delete(id) },
    clearTimer(name) { timers.delete(name) },
    schedule(name, fn) { timers.set(name, fn) },
    window: { matchMedia: () => ({ matches: false }) },
    setSpringing() {},
    setJumping() {},
    stopVoice() {},
    playBoing() {},
  })
  vm.runInContext(extract('onPointerMove') + extract('releaseSpring'), context)
  return { context, pending, timers, stack }
}

test('spring pointer updates coalesce into one frame with the latest pull', () => {
  const run = spring()
  for (const y of [20, 80, 150]) {
    run.context.onPointerMove({ pointerId: 1, clientY: y })
  }
  assert.equal(run.pending.size, 1)
  run.pending.get(1)()
  assert.match(run.stack.style.transform, /^scale\(1\.08/)
  assert.equal(run.context.springRef.current.raf, 0)
})

test('release cancels a pending pull frame and clears the transform on completion', () => {
  const run = spring()
  run.context.onPointerMove({ pointerId: 1, clientY: 150 })
  run.context.releaseSpring()
  assert.equal(run.pending.size, 0)
  assert.equal(run.context.springRef.current, null)
  assert.equal(run.context.jumpingRef.current, true)
  run.timers.get('springEnd')()
  assert.equal(run.stack.style.transform, '')
  assert.equal(run.context.jumpingRef.current, false)
})

test('a tiny pull returns to idle without leaving an inline transform', () => {
  const run = spring()
  run.stack.style.transform = 'scale(1, 1)'
  run.context.releaseSpring()
  assert.equal(run.stack.style.transform, '')
  assert.equal(run.timers.size, 0)
})
