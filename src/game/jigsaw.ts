import { randomRot, rotate, type Tile } from './engine'
import { shuffleInPlace } from './rng'

/** Pieces start in a tray; a piece locks only on its own cell at rotation 0. */
export interface JigsawState {
  n: number
  board: (Tile | null)[]
  tray: Tile[]
}

export function createJigsaw(n: number, rotation: boolean, rand: () => number = Math.random): JigsawState {
  const tray = shuffleInPlace(
    Array.from({ length: n * n }, (_, id): Tile => ({ id, rot: rotation ? randomRot(rand) : 0 })),
    rand,
  )
  // With rotation on, make sure at least one piece actually needs turning.
  if (rotation && tray.every((t) => t.rot === 0)) tray[0] = { ...tray[0], rot: 1 }
  return { n, board: Array(n * n).fill(null), tray }
}

export function canPlace(s: JigsawState, tileId: number, cell: number): boolean {
  const tile = s.tray.find((t) => t.id === tileId)
  return !!tile && s.board[cell] === null && tile.id === cell && tile.rot === 0
}

/** Returns the same state object when the drop is wrong. */
export function placePiece(s: JigsawState, tileId: number, cell: number): JigsawState {
  if (!canPlace(s, tileId, cell)) return s
  const board = s.board.slice()
  board[cell] = { id: tileId, rot: 0 }
  return { ...s, board, tray: s.tray.filter((t) => t.id !== tileId) }
}

export function rotateTrayPiece(s: JigsawState, tileId: number): JigsawState {
  return { ...s, tray: s.tray.map((t) => (t.id === tileId ? rotate(t) : t)) }
}

export function lockedCount(s: JigsawState): number {
  return s.board.filter(Boolean).length
}

export function isJigsawSolved(s: JigsawState): boolean {
  return s.board.every((t, i) => t !== null && t.id === i && t.rot === 0)
}

/** Places the first tray piece in its cell. Returns the cell placed, or null. */
export function jigsawHint(s: JigsawState): { state: JigsawState; cell: number } | null {
  const tile = s.tray[0]
  if (!tile) return null
  const fixed = { ...s, tray: s.tray.map((t) => (t.id === tile.id ? { ...t, rot: 0 as const } : t)) }
  return { state: placePiece(fixed, tile.id, tile.id), cell: tile.id }
}
