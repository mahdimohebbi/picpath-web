import { forwardRef, useImperativeHandle, useState } from 'react'
import {
  createSwap,
  isLocked,
  isSwapSolved,
  rotateTile,
  swapHint,
  swapLockedCount,
  swapTiles,
  type SwapState,
} from '../../game/swap'
import { buzz } from '../../lib/feedback'
import { PuzzleTile } from '../PuzzleTile'
import styles from './Board.module.css'
import type { BoardHandle, BoardProps } from './types'

/** Tap two tiles to swap. With rotation on, tap a selected tile again to turn it. */
export const SwapBoard = forwardRef<BoardHandle, BoardProps>(function SwapBoard(
  { level, src, disabled, onMove, onProgress, onSolved },
  ref,
) {
  const n = level.grid
  const [state, setState] = useState(() => createSwap(n, level.rotation))
  const [selected, setSelected] = useState<number | null>(null)
  const [popped, setPopped] = useState<Set<number>>(new Set())

  function commit(next: SwapState) {
    const newlyLocked = next.cells.map((_, i) => i).filter((i) => isLocked(next, i) && !isLocked(state, i))
    setState(next)
    if (newlyLocked.length) {
      setPopped(new Set(newlyLocked))
      buzz(20)
    }
    onProgress(swapLockedCount(next), n * n)
    if (isSwapSolved(next)) onSolved()
  }

  useImperativeHandle(ref, () => ({
    hint() {
      const r = swapHint(state)
      if (!r) return false
      setSelected(null)
      commit(r.state)
      return true
    },
  }))

  function tap(i: number) {
    if (disabled || isLocked(state, i)) return
    if (selected === null) return setSelected(i)
    if (selected === i) {
      if (!level.rotation) return setSelected(null)
      onMove()
      const next = rotateTile(state, i)
      if (isLocked(next, i)) setSelected(null)
      return commit(next)
    }
    onMove()
    setSelected(null)
    commit(swapTiles(state, selected, i))
  }

  const solved = isSwapSolved(state)
  return (
    <div className={styles.solo}>
      <div className={`${styles.board} ${styles.abs} ${solved ? styles.solved : ''}`}>
        {state.cells.map((t, i) => {
          const locked = isLocked(state, i)
          return (
            <button
              key={t.id}
              data-id={t.id}
              type="button"
              className={`${styles.slot} ${locked ? styles.lockedTile : ''} ${selected === i ? styles.selected : ''}`}
              style={{
                width: `${100 / n}%`,
                transform: `translate(${(i % n) * 100}%, ${Math.floor(i / n) * 100}%)`,
              }}
              onClick={() => tap(i)}
              aria-label={`Tile ${i + 1}${locked ? ', locked' : ''}`}
            >
              <PuzzleTile
                src={src}
                n={n}
                id={t.id}
                rot={t.rot}
                className={popped.has(i) && locked ? styles.pop : undefined}
              />
            </button>
          )
        })}
      </div>
    </div>
  )
})
