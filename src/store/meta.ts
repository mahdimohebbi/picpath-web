/** Pure helpers for hearts and streak (timestamp-based, testable). */

export const MAX_HEARTS = 5
export const HEART_REGEN_MS = 30 * 60 * 1000

export interface HeartState {
  hearts: number
  /** Timestamp the regen clock last advanced from. */
  heartsAt: number
}

export function regenHearts(s: HeartState, now: number): HeartState {
  if (s.hearts >= MAX_HEARTS) return { hearts: MAX_HEARTS, heartsAt: now }
  const gained = Math.floor((now - s.heartsAt) / HEART_REGEN_MS)
  if (gained <= 0) return s
  const hearts = Math.min(MAX_HEARTS, s.hearts + gained)
  return { hearts, heartsAt: hearts >= MAX_HEARTS ? now : s.heartsAt + gained * HEART_REGEN_MS }
}

export function loseHeart(s: HeartState, now: number): HeartState {
  const cur = regenHearts(s, now)
  // Losing from full starts the regen clock now.
  return { hearts: Math.max(0, cur.hearts - 1), heartsAt: cur.hearts >= MAX_HEARTS ? now : cur.heartsAt }
}

/** ms until the next heart, or 0 when full. */
export function nextHeartIn(s: HeartState, now: number): number {
  const cur = regenHearts(s, now)
  if (cur.hearts >= MAX_HEARTS) return 0
  return HEART_REGEN_MS - (now - cur.heartsAt)
}

export function dayKey(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}

function prevDay(key: string): string {
  const [y, m, d] = key.split('-').map(Number)
  return dayKey(new Date(y, m - 1, d - 1))
}

export interface StreakState {
  streak: number
  lastDay: string | null
}

/** Call when a level is completed on `today`. */
export function bumpStreak(s: StreakState, today: string): StreakState {
  if (s.lastDay === today) return s
  if (s.lastDay === prevDay(today)) return { streak: s.streak + 1, lastDay: today }
  return { streak: 1, lastDay: today }
}

/** Streak to show: it lapses if neither today nor yesterday was played. */
export function visibleStreak(s: StreakState, today: string): number {
  return s.lastDay === today || s.lastDay === prevDay(today) ? s.streak : 0
}

export function formatMs(ms: number): string {
  const total = Math.ceil(ms / 1000)
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`
}
