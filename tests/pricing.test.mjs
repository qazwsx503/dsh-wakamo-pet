import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import vm from 'node:vm'

const source = readFileSync(new URL('../src/client.template.js', import.meta.url), 'utf8')
const start = source.indexOf('    function deepSeekPeriod(')
const end = source.indexOf('    function clamp(', start)
const context = vm.createContext({})
vm.runInContext(source.slice(start, end), context)
const time = value => Date.parse(value + '+08:00')

test('Beijing weekday pricing boundaries', () => {
  for (const [clock, expected] of [
    ['08:59:59', 'off-peak'], ['09:00:00', 'peak'],
    ['11:59:59', 'peak'], ['12:00:00', 'off-peak'],
    ['13:59:59', 'off-peak'], ['14:00:00', 'peak'],
    ['17:59:59', 'peak'], ['18:00:00', 'off-peak'],
  ]) assert.equal(context.deepSeekPeriod(time(`2026-10-19T${clock}`)), expected, clock)
})

test('weekends and holidays are off-peak, including a makeup Saturday', () => {
  for (const day of ['01-01', '02-20', '04-06', '05-04', '06-19', '09-25', '10-01', '10-10', '10-18']) {
    assert.equal(context.deepSeekPeriod(time(`2026-${day}T10:00:00`)), 'off-peak', day)
  }
})

test('unknown years are not guessed', () => {
  assert.equal(context.deepSeekPeriod(time('2027-01-04T10:00:00')), 'unknown')
  assert.match(context.deepSeekPeriodMessage(time('2027-01-04T10:00:00')), /未更新/)
})

test('next transition skips weekends and holidays', () => {
  assert.match(context.deepSeekPeriodMessage(time('2026-10-19T10:00:00')), /12:00/)
  assert.match(context.deepSeekPeriodMessage(time('2026-10-23T18:00:00')), /10\/26 09:00/)
  assert.match(context.deepSeekPeriodMessage(time('2026-09-30T18:00:00')), /10\/08 09:00/)
})
