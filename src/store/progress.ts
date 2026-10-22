import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { MAX_HEARTS, bumpStreak, dayKey, loseHeart, regenHearts } from './meta'

interface ProgressState {
  /** Best stars per completed level id. */
  stars: Record<number, number>
  xp: number
  hearts: number
  heartsAt: number
  streak: number
  lastDay: string | null
  sound: boolean
  completeLevel: (id: number, stars: number, xp: number) => void
  failLevel: () => void
  syncHearts: () => void
  toggleSound: () => void
  reset: () => void
}

const initial = () => ({
  stars: {},
  xp: 0,
  hearts: MAX_HEARTS,
  heartsAt: Date.now(),
  streak: 0,
  lastDay: null,
  sound: true,
})

export const useProgress = create<ProgressState>()(
  persist(
    (set) => ({
      ...initial(),
      completeLevel: (id, stars, xp) =>
        set((s) => {
          // Pick only the streak fields: bumpStreak returns the whole state when nothing changes.
          const { streak, lastDay } = bumpStreak(s, dayKey(new Date()))
          return {
            stars: { ...s.stars, [id]: Math.max(stars, s.stars[id] ?? 0) },
            xp: s.xp + xp,
            streak,
            lastDay,
          }
        }),
      failLevel: () => set((s) => loseHeart(s, Date.now())),
      syncHearts: () =>
        set((s) => {
          const next = regenHearts(s, Date.now())
          return next === s ? s : next
        }),
      toggleSound: () => set((s) => ({ sound: !s.sound })),
      reset: () => set(initial()),
    }),
    { name: 'picpath-progress', version: 1 },
  ),
)
