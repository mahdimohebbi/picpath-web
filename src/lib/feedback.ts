import { useProgress } from '../store/progress'
import { play, type Sound } from './sound'

const VIBRATION: Partial<Record<Sound, number | number[]>> = {
  snap: 20,
  wrong: [15, 40, 15],
  win: [30, 60, 30, 60, 60],
  fail: 120,
}

/** Sound (if enabled in Profile) plus haptics where supported. */
export function feedback(kind: Sound) {
  if (useProgress.getState().sound) play(kind)
  const pattern = VIBRATION[kind]
  if (pattern === undefined) return
  try {
    navigator.vibrate?.(pattern)
  } catch {
    // vibrate can throw when blocked by permissions policy
  }
}
