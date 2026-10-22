import { describe, expect, it } from 'vitest'
import { mulberry32 } from './rng'
import { canSlide, createSliding, isSlidingSolved, isSolvable, slide, slidingHint, solvedSliding } from './sliding'

describe('sliding', () => {
  it('always produces a solvable, unsolved shuffle', () => {
    for (const n of [3, 4]) {
      for (let seed = 0; seed < 100; seed++) {
        const s = createSliding(n, undefined, mulberry32(seed))
        expect(isSolvable(s.cells, n)).toBe(true)
        expect(isSlidingSolved(s)).toBe(false)
      }
    }
  })

  it('parity check rejects a swapped pair', () => {
    const cells = solvedSliding(3).cells.slice()
    ;[cells[0], cells[1]] = [cells[1], cells[0]]
    expect(isSolvable(cells, 3)).toBe(false)
    expect(isSolvable(solvedSliding(4).cells, 4)).toBe(true)
  })

  it('only slides tiles next to the blank', () => {
    const s = solvedSliding(3)
    expect(canSlide(s, 7)).toBe(true)
    expect(canSlide(s, 0)).toBe(false)
    expect(slide(s, 0)).toBe(s)
  })

  it('hints retrace to the solved state, even after detours', () => {
    let s = createSliding(4, 60, mulberry32(42))
    const rand = mulberry32(1)
    for (let k = 0; k < 25; k++) {
      const opts = [s.blank - 1, s.blank + 1, s.blank - 4, s.blank + 4].filter((c) => c >= 0 && c < 16 && canSlide(s, c))
      s = slide(s, opts[Math.floor(rand() * opts.length)])
    }
    let guard = 0
    while (!isSlidingSolved(s) && guard++ < 500) s = slidingHint(s)!.state
    expect(isSlidingSolved(s)).toBe(true)
  })
})
