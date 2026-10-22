import { randomRot, rotate, type Tile } from './engine'
import { shuffleInPlace } from './rng'

/** All tiles start on the board, shuffled; tap two to swap. Correct tiles lock. */
export interface SwapState {
  n: number
  cells: Tile[]
}

export function createSwap(n: number, rotation: boolean, rand: () => number = Math.random): SwapState {
  const size = n * n
  let cells: Tile[]
  // Reshuffle until few tiles start in place, so the board really looks scrambled.
  do {
    cells = shuffleInPlace(
      Array.from({ length: size }, (_, id): Tile => ({ id, rot: rotation ? randomRot(rand) : 0 })),
      rand,
    )
  } while (cells.filter((t, i) => t.id === i && t.rot === 0).length > Math.floor(n / 2))
  return { n, cells }
}

export function isLocked(s: SwapState, i: number): boolean {
  return s.cells[i].id === i && s.cells[i].rot === 0
}

export function swapTiles(s: SwapState, a: number, b: number): SwapState {
  if (a === b || isLocked(s, a) || isLocked(s, b)) return s
  const cells = s.cells.slice()
  ;[cells[a], cells[b]] = [cells[b], cells[a]]
  return { ...s, cells }
}

export function rotateTile(s: SwapState, i: number): SwapState {
  if (isLocked(s, i)) return s
  const cells = s.cells.slice()
  cells[i] = rotate(cells[i])
  return { ...s, cells }
}

export function swapLockedCount(s: SwapState): number {
  return s.cells.filter((_, i) => isLocked(s, i)).length
}

export function isSwapSolved(s: SwapState): boolean {
  return s.cells.every((_, i) => isLocked(s, i))
}

/** Moves the right tile into the first unlocked cell, upright. */
export function swapHint(s: SwapState): { state: SwapState; cell: number } | null {
  const cell = s.cells.findIndex((_, i) => !isLocked(s, i))
  if (cell < 0) return null
  const from = s.cells.findIndex((t) => t.id === cell)
  const cells = s.cells.slice()
  cells[from] = cells[cell]
  cells[cell] = { id: cell, rot: 0 }
  return { state: { ...s, cells }, cell }
}
