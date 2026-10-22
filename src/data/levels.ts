import type { Level, Unit } from '../game/engine'
import data from './levels.json'

export const units = data.units as Unit[]
export const levels = data.levels as Level[]

export function getLevel(id: number): Level | undefined {
  return levels.find((l) => l.id === id)
}

export function getUnit(id: number): Unit {
  return units.find((u) => u.id === id) ?? units[0]
}

export function imageUrl(image: string): string {
  return `${import.meta.env.BASE_URL}puzzles/${image}.webp`
}

/** A level is playable once the previous one has been completed. */
export function isUnlocked(id: number, stars: Record<number, number>): boolean {
  return id === 1 || (stars[id - 1] ?? 0) > 0
}

/** The first unlocked level not yet completed (or the last one when all are done). */
export function currentLevelId(stars: Record<number, number>): number {
  const next = levels.find((l) => !stars[l.id] && isUnlocked(l.id, stars))
  return next?.id ?? levels[levels.length - 1].id
}
