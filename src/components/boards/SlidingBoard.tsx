import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import {
  canSlide,
  createSliding,
  isSlidingSolved,
  slide,
  slidingCorrectCount,
  slidingHint,
  type SlidingState,
} from '../../game/sliding'
import { feedback } from '../../lib/feedback'
import { PuzzleTile } from '../PuzzleTile'
import styles from './Board.module.css'
import type { BoardHandle, BoardProps } from './types'

const HINT_STEP_MS = 140

/** Classic sliding puzzle: tap a tile next to the gap. A hint replays a few moves toward solved. */
export const SlidingBoard = forwardRef<BoardHandle, BoardProps>(function SlidingBoard(
  { level, src, disabled, onMove, onProgress, onSolved },
  ref,
) {
  const n = level.grid
  const blankId = n * n - 1
  const [state, setState] = useState(() => createSliding(n))
  const [replaying, setReplaying] = useState(false)
  const stateRef = useRef(state)
  const timer = useRef<ReturnType<typeof setInterval>>(undefined)

  useEffect(() => () => clearInterval(timer.current), [])

  function commit(next: SlidingState) {
    feedback(slidingCorrectCount(next) > slidingCorrectCount(stateRef.current) ? 'snap' : 'tap')
    stateRef.current = next
    setState(next)
    onProgress(slidingCorrectCount(next), n * n - 1)
    if (isSlidingSolved(next)) {
      clearInterval(timer.current)
      setReplaying(false)
      onSolved()
    }
  }

  useImperativeHandle(ref, () => ({
    hint() {
      if (replaying || !stateRef.current.path.length) return false
      let left = n * 2
      setReplaying(true)
      timer.current = setInterval(() => {
        const r = slidingHint(stateRef.current)
        if (r) commit(r.state)
        if (!r || --left <= 0 || isSlidingSolved(stateRef.current)) {
          clearInterval(timer.current)
          setReplaying(false)
        }
      }, HINT_STEP_MS)
      return true
    },
  }))

  function tap(cell: number) {
    if (disabled || replaying || !canSlide(state, cell)) return
    onMove()
    commit(slide(state, cell))
  }

  const solved = isSlidingSolved(state)
  return (
    <div className={styles.solo}>
      <div className={`${styles.board} ${styles.abs} ${solved ? styles.solved : ''}`}>
        {state.cells.map((t, i) => {
          if (t === blankId && !solved) return null
          return (
            <button
              key={t}
              data-id={t}
              type="button"
              className={`${styles.slot} ${styles.slideTile} ${t === blankId ? styles.fadeIn : ''} ${
                canSlide(state, i) && !solved ? styles.movable : ''
              }`}
              style={{
                width: `${100 / n}%`,
                transform: `translate(${(i % n) * 100}%, ${Math.floor(i / n) * 100}%)`,
              }}
              onClick={() => tap(i)}
              aria-label={`Tile ${t + 1}`}
            >
              <PuzzleTile src={src} n={n} id={t} />
            </button>
          )
        })}
      </div>
    </div>
  )
})
