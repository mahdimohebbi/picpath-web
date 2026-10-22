import { beforeEach, describe, expect, it } from 'vitest'
import { useProgress } from './progress'

describe('progress store', () => {
  beforeEach(() => useProgress.getState().reset())

  it('keeps every level completed on the same day', () => {
    const { completeLevel } = useProgress.getState()
    completeLevel(1, 3, 25)
    completeLevel(2, 2, 20)
    completeLevel(3, 1, 15)
    const s = useProgress.getState()
    expect(s.stars).toEqual({ 1: 3, 2: 2, 3: 1 })
    expect(s.xp).toBe(60)
    expect(s.streak).toBe(1)
  })

  it('keeps the best stars on replay', () => {
    const { completeLevel } = useProgress.getState()
    completeLevel(1, 3, 25)
    completeLevel(1, 1, 15)
    expect(useProgress.getState().stars[1]).toBe(3)
  })
})
