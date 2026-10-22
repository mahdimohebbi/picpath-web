import { describe, expect, it } from 'vitest'
import { mulberry32 } from './rng'
import { createSwap, isLocked, isSwapSolved, rotateTile, swapHint, swapTiles } from './swap'

describe('swap', () => {
  it('shuffles into a valid, unsolved permutation', () => {
    for (let seed = 0; seed < 50; seed++) {
      const s = createSwap(4, seed % 2 === 0, mulberry32(seed))
      expect(s.cells.map((t) => t.id).sort((a, b) => a - b)).toEqual([...Array(16).keys()])
      expect(isSwapSolved(s)).toBe(false)
    }
  })

  it('locks correct tiles so they cannot be swapped away', () => {
    let s = createSwap(3, false, mulberry32(7))
    const target = s.cells.findIndex((t, i) => t.id !== i)
    const from = s.cells.findIndex((t) => t.id === target)
    s = swapTiles(s, target, from)
    expect(isLocked(s, target)).toBe(true)
    const other = s.cells.findIndex((_, i) => !isLocked(s, i))
    expect(swapTiles(s, target, other)).toBe(s)
    expect(rotateTile(s, target)).toBe(s)
  })

  it('detects the win once every tile is home and upright', () => {
    let s = createSwap(5, true, mulberry32(9))
    let guard = 0
    while (!isSwapSolved(s) && guard++ < 100) s = swapHint(s)!.state
    expect(isSwapSolved(s)).toBe(true)
    expect(swapHint(s)).toBeNull()
  })
})
