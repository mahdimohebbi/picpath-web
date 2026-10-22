import { describe, expect, it } from 'vitest'
import { HEART_REGEN_MS, MAX_HEARTS, bumpStreak, loseHeart, nextHeartIn, regenHearts, visibleStreak } from './meta'

describe('hearts', () => {
  it('regenerates one heart per 30 minutes, capped at max', () => {
    const s = { hearts: 2, heartsAt: 0 }
    expect(regenHearts(s, HEART_REGEN_MS - 1).hearts).toBe(2)
    expect(regenHearts(s, HEART_REGEN_MS * 2 + 5)).toEqual({ hearts: 4, heartsAt: HEART_REGEN_MS * 2 })
    expect(regenHearts(s, HEART_REGEN_MS * 10).hearts).toBe(MAX_HEARTS)
  })

  it('starts the regen clock when losing a heart from full', () => {
    const s = loseHeart({ hearts: MAX_HEARTS, heartsAt: 0 }, 1000)
    expect(s).toEqual({ hearts: MAX_HEARTS - 1, heartsAt: 1000 })
    expect(nextHeartIn(s, 1000)).toBe(HEART_REGEN_MS)
  })

  it('never goes below zero', () => {
    expect(loseHeart({ hearts: 0, heartsAt: 0 }, 1).hearts).toBe(0)
  })
})

describe('streak', () => {
  it('increments on consecutive days and resets after a gap', () => {
    let s = bumpStreak({ streak: 0, lastDay: null }, '2026-01-31')
    expect(s.streak).toBe(1)
    s = bumpStreak(s, '2026-01-31')
    expect(s.streak).toBe(1)
    s = bumpStreak(s, '2026-02-01')
    expect(s.streak).toBe(2)
    expect(bumpStreak(s, '2026-02-03').streak).toBe(1)
  })

  it('shows 0 once a day is missed', () => {
    const s = { streak: 4, lastDay: '2026-03-01' }
    expect(visibleStreak(s, '2026-03-02')).toBe(4)
    expect(visibleStreak(s, '2026-03-03')).toBe(0)
  })
})
