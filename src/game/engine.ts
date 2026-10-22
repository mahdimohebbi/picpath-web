/** Shared game types and pure scoring rules. No React here. */

export type Mode = 'jigsaw' | 'swap' | 'sliding'
export type Rot = 0 | 1 | 2 | 3
/** full = reference shown · half = 50% opacity · toggle = hidden, tap to peek · timed = hidden after 5s */
export type ReferenceMode = 'full' | 'half' | 'toggle' | 'timed'

export interface Unit {
  id: number
  title: string
  color: string
  colorDark: string
}

export interface Level {
  id: number
  unit: number
  /** 1–6 within the unit; 6 is the boss. */
  index: number
  boss: boolean
  mode: Mode
  grid: number
  image: string
  rotation: boolean
  reference: ReferenceMode
  parMoves: number
  parTime: number
  /** Hard limits: exceeding one fails the level and costs a heart. */
  limit?: { moves?: number; time?: number }
}

/** A puzzle piece: `id` is its solved cell index, `rot` quarter turns clockwise. */
export interface Tile {
  id: number
  rot: Rot
}

export interface PlayStats {
  moves: number
  seconds: number
  hints: number
}

export const HINTS_PER_LEVEL = 3

/** 3 = under par time and moves with no hints; 2 = one miss (limit or hint); 1 = completed. */
export function computeStars(level: Pick<Level, 'parMoves' | 'parTime'>, s: PlayStats): 1 | 2 | 3 {
  const misses = Number(s.moves > level.parMoves) + Number(s.seconds > level.parTime) + s.hints
  return misses === 0 ? 3 : misses === 1 ? 2 : 1
}

/** 10 + 5 per star, doubled for boss levels. */
export function computeXp(stars: number, boss: boolean): number {
  return (10 + 5 * stars) * (boss ? 2 : 1)
}

export function isOverLimit(level: Pick<Level, 'limit'>, s: Pick<PlayStats, 'moves' | 'seconds'>): boolean {
  const { limit } = level
  if (!limit) return false
  return (limit.moves !== undefined && s.moves > limit.moves) || (limit.time !== undefined && s.seconds > limit.time)
}

export function rotate(t: Tile): Tile {
  return { id: t.id, rot: ((t.rot + 1) % 4) as Rot }
}

export function randomRot(rand: () => number): Rot {
  return Math.floor(rand() * 4) as Rot
}
