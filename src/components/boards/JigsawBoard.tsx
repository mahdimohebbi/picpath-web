import { forwardRef, useImperativeHandle, useRef, useState, type WheelEvent } from 'react'
import {
  createJigsaw,
  isJigsawSolved,
  jigsawHint,
  lockedCount,
  placePiece,
  rotateTrayPiece,
  type JigsawState,
} from '../../game/jigsaw'
import { feedback } from '../../lib/feedback'
import { PuzzleTile } from '../PuzzleTile'
import styles from './Board.module.css'
import type { BoardHandle, BoardProps } from './types'

/** Tap a tray piece to pick it up, then tap its cell. With rotation on, tap the picked piece again to turn it. */
export const JigsawBoard = forwardRef<BoardHandle, BoardProps>(function JigsawBoard(
  { level, src, disabled, onMove, onProgress, onSolved },
  ref,
) {
  const n = level.grid
  const [state, setState] = useState(() => createJigsaw(n, level.rotation))
  const [selected, setSelected] = useState<number | null>(null)
  const [flash, setFlash] = useState<{ cell: number; ok: boolean; key: number } | null>(null)
  const trayRef = useRef<HTMLDivElement>(null)

  function commit(next: JigsawState) {
    setState(next)
    onProgress(lockedCount(next), n * n)
    if (isJigsawSolved(next)) onSolved()
  }

  useImperativeHandle(ref, () => ({
    hint() {
      const r = jigsawHint(state)
      if (!r) return false
      if (selected === r.cell) setSelected(null)
      setFlash({ cell: r.cell, ok: true, key: Date.now() })
      commit(r.state)
      return true
    },
  }))

  function tapPiece(id: number) {
    if (disabled) return
    if (selected !== id) {
      feedback('tap')
      setSelected(id)
      return
    }
    if (level.rotation) {
      onMove()
      feedback('tap')
      setState(rotateTrayPiece(state, id))
    } else {
      setSelected(null)
    }
  }

  function tapCell(cell: number) {
    if (disabled || selected === null || state.board[cell]) return
    onMove()
    const next = placePiece(state, selected, cell)
    if (next === state) {
      // keep the piece picked up so the player can try another cell
      setFlash({ cell, ok: false, key: Date.now() })
      feedback('wrong')
      return
    }
    setSelected(null)
    setFlash({ cell, ok: true, key: Date.now() })
    feedback('snap')
    commit(next)
  }

  // Mouse wheels scroll vertically; turn that into sideways tray scrolling on desktop.
  function onWheel(e: WheelEvent<HTMLDivElement>) {
    if (trayRef.current && Math.abs(e.deltaY) > Math.abs(e.deltaX)) trayRef.current.scrollLeft += e.deltaY
  }

  const solved = state.tray.length === 0
  const picked = selected !== null

  return (
    <div className={styles.jigsaw}>
      <div className={styles.boardWrap}>
        <div
          className={`${styles.board} ${solved ? styles.solved : ''} ${picked ? styles.targeting : ''}`}
          style={{ gridTemplateColumns: `repeat(${n}, 1fr)` }}
        >
          {state.board.map((t, i) => (
            <button
              key={flash?.cell === i ? `${i}-${flash.key}` : i}
              type="button"
              data-cell={i}
              className={`${styles.cell} ${t ? '' : styles.empty} ${
                flash?.cell === i ? (flash.ok ? styles.pop : styles.wrong) : ''
              }`}
              onClick={() => tapCell(i)}
              disabled={!!t || disabled}
              aria-label={t ? `Cell ${i + 1}, filled` : `Cell ${i + 1}`}
            >
              {t && <PuzzleTile src={src} n={n} id={t.id} />}
            </button>
          ))}
        </div>
      </div>
      <p className={styles.helper} aria-live="polite">
        {picked
          ? level.rotation
            ? 'Tap a cell to place it · tap the piece again to turn it'
            : 'Now tap the cell where it belongs'
          : 'Tap a piece to pick it up'}
      </p>
      <div ref={trayRef} className={styles.tray} aria-label="Pieces" onWheel={onWheel}>
        {state.tray.map((t) => (
          <button
            key={t.id}
            type="button"
            data-id={t.id}
            className={`${styles.piece} ${selected === t.id ? styles.picked : ''}`}
            onClick={() => tapPiece(t.id)}
            aria-pressed={selected === t.id}
            aria-label={level.rotation ? 'Piece: tap to pick up, tap again to rotate' : 'Piece: tap to pick up'}
          >
            <PuzzleTile src={src} n={n} id={t.id} rot={t.rot} />
          </button>
        ))}
      </div>
    </div>
  )
})
