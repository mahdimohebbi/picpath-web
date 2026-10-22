import { describe, expect, it } from 'vitest'
import { computeStars, computeXp, isOverLimit } from './engine'

const par = { parMoves: 20, parTime: 60 }

describe('stars', () => {
  it('gives 3 stars under par with no hints', () => {
    expect(computeStars(par, { moves: 20, seconds: 60, hints: 0 })).toBe(3)
  })
  it('gives 2 stars for one missed limit or one hint', () => {
    expect(computeStars(par, { moves: 21, seconds: 10, hints: 0 })).toBe(2)
    expect(computeStars(par, { moves: 5, seconds: 61, hints: 0 })).toBe(2)
    expect(computeStars(par, { moves: 5, seconds: 10, hints: 1 })).toBe(2)
  })
  it('gives 1 star otherwise', () => {
    expect(computeStars(par, { moves: 21, seconds: 61, hints: 0 })).toBe(1)
    expect(computeStars(par, { moves: 1, seconds: 1, hints: 2 })).toBe(1)
  })
})

describe('xp and limits', () => {
  it('awards 10 + 5/star, doubled for boss', () => {
    expect(computeXp(3, false)).toBe(25)
    expect(computeXp(1, true)).toBe(30)
  })
  it('detects exceeded limits', () => {
    expect(isOverLimit({}, { moves: 999, seconds: 999 })).toBe(false)
    expect(isOverLimit({ limit: { time: 30 } }, { moves: 0, seconds: 31 })).toBe(true)
    expect(isOverLimit({ limit: { moves: 30 } }, { moves: 30, seconds: 999 })).toBe(false)
  })
})
