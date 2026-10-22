/** Classic n-puzzle. Tile id n*n-1 is the blank. Shuffled only by legal moves, so always solvable. */
export interface SlidingState {
  n: number
  /** Tile id at each cell. */
  cells: number[]
  blank: number
  /** Blank positions to retrace back to solved; drives hints. */
  path: number[]
}

export function shuffleMovesFor(n: number): number {
  return n <= 3 ? 40 : 110
}

export function neighbors(n: number, i: number): number[] {
  const r = Math.floor(i / n)
  const c = i % n
  const out: number[] = []
  if (r > 0) out.push(i - n)
  if (r < n - 1) out.push(i + n)
  if (c > 0) out.push(i - 1)
  if (c < n - 1) out.push(i + 1)
  return out
}

export function solvedSliding(n: number): SlidingState {
  return { n, cells: Array.from({ length: n * n }, (_, i) => i), blank: n * n - 1, path: [] }
}

export function createSliding(n: number, moves = shuffleMovesFor(n), rand: () => number = Math.random): SlidingState {
  let s = solvedSliding(n)
  let prev = -1
  for (let k = 0; k < moves || isSlidingSolved(s); k++) {
    const options = neighbors(n, s.blank).filter((c) => c !== prev)
    const next = options[Math.floor(rand() * options.length)]
    prev = s.blank
    s = slide(s, next)
  }
  return s
}

export function canSlide(s: SlidingState, cell: number): boolean {
  return neighbors(s.n, s.blank).includes(cell)
}

/** Moves the tile at `cell` into the blank. Returns the same object if illegal. */
export function slide(s: SlidingState, cell: number): SlidingState {
  if (!canSlide(s, cell)) return s
  const cells = s.cells.slice()
  ;[cells[s.blank], cells[cell]] = [cells[cell], cells[s.blank]]
  const path = s.path.slice()
  if (path[path.length - 1] === cell) path.pop()
  else path.push(s.blank)
  return { ...s, cells, blank: cell, path }
}

export function isSlidingSolved(s: SlidingState): boolean {
  return s.cells.every((t, i) => t === i)
}

/** Tiles (excluding the blank) sitting in their home cell. */
export function slidingCorrectCount(s: SlidingState): number {
  return s.cells.filter((t, i) => t === i && t !== s.n * s.n - 1).length
}

/** Plays the next move on the way back to solved. */
export function slidingHint(s: SlidingState, steps = 1): { state: SlidingState; cell: number } | null {
  if (!s.path.length) return null
  let state = s
  let cell = -1
  for (let k = 0; k < steps && state.path.length; k++) {
    // the tile now in the target cell moves into the blank, i.e. it ends up where the blank was
    cell = state.blank
    state = slide(state, state.path[state.path.length - 1])
  }
  return { state, cell }
}

/** Standard parity test, used to verify shuffles in tests. */
export function isSolvable(cells: number[], n: number): boolean {
  const blankId = n * n - 1
  const seq = cells.filter((t) => t !== blankId)
  let inversions = 0
  for (let i = 0; i < seq.length; i++) for (let j = i + 1; j < seq.length; j++) if (seq[i] > seq[j]) inversions++
  if (n % 2 === 1) return inversions % 2 === 0
  const blankRowFromBottom = n - Math.floor(cells.indexOf(blankId) / n)
  return (inversions + blankRowFromBottom) % 2 === 1
}
