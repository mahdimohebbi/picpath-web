import { forwardRef, useImperativeHandle, useRef, useState, type PointerEvent } from 'react'
import type { Rot } from '../../game/engine'
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

const DRAG_THRESHOLD = 8
const LIFT_DISTANCE = 30

interface Drag {
  id: number
  rot: Rot
  x: number
  y: number
  size: number
}

export const JigsawBoard = forwardRef<BoardHandle, BoardProps>(function JigsawBoard(
  { level, src, disabled, onMove, onProgress, onSolved },
  ref,
) {
  const n = level.grid
  const [state, setState] = useState(() => createJigsaw(n, level.rotation))
  const [drag, setDrag] = useState<Drag | null>(null)
  const [flash, setFlash] = useState<{ cell: number; ok: boolean; key: number } | null>(null)
  const boardRef = useRef<HTMLDivElement>(null)
  const trayRef = useRef<HTMLDivElement>(null)
  /** pending until the gesture direction is known: mostly-horizontal scrolls the tray, anything else drags. */
  const press = useRef<{ id: number; x: number; y: number; scroll: number; mode: 'pending' | 'drag' | 'scroll' } | null>(
    null,
  )

  function commit(next: JigsawState) {
    setState(next)
    onProgress(lockedCount(next), n * n)
    if (isJigsawSolved(next)) onSolved()
  }

  useImperativeHandle(ref, () => ({
    hint() {
      const r = jigsawHint(state)
      if (!r) return false
      setFlash({ cell: r.cell, ok: true, key: Date.now() })
      commit(r.state)
      return true
    },
  }))

  function cellAt(x: number, y: number): number | null {
    const rect = boardRef.current?.getBoundingClientRect()
    if (!rect || x < rect.left || y < rect.top || x >= rect.right || y >= rect.bottom) return null
    const col = Math.floor(((x - rect.left) / rect.width) * n)
    const row = Math.floor(((y - rect.top) / rect.height) * n)
    return row * n + col
  }

  function onDown(e: PointerEvent<HTMLDivElement>, id: number) {
    if (disabled || !e.isPrimary) return
    e.currentTarget.setPointerCapture(e.pointerId)
    press.current = { id, x: e.clientX, y: e.clientY, scroll: trayRef.current?.scrollLeft ?? 0, mode: 'pending' }
  }

  function onMovePtr(e: PointerEvent<HTMLDivElement>) {
    const p = press.current
    if (!p) return
    const dx = e.clientX - p.x
    const dy = e.clientY - p.y
    if (p.mode === 'pending') {
      if (Math.hypot(dx, dy) < DRAG_THRESHOLD) return
      p.mode = Math.abs(dx) > 3 * Math.abs(dy) ? 'scroll' : 'drag'
    }
    // Pulling up out of the tray turns a scroll into a drag.
    if (p.mode === 'scroll' && dy < -LIFT_DISTANCE) p.mode = 'drag'
    if (p.mode === 'scroll') {
      if (trayRef.current) trayRef.current.scrollLeft = p.scroll - dx
      return
    }
    const size = (boardRef.current?.getBoundingClientRect().width ?? 320) / n
    const tile = state.tray.find((t) => t.id === p.id)
    setDrag({ id: p.id, rot: tile?.rot ?? 0, x: e.clientX, y: e.clientY, size })
  }

  function onUp(e: PointerEvent<HTMLDivElement>) {
    const p = press.current
    press.current = null
    setDrag(null)
    if (!p) return
    if (p.mode === 'scroll') return
    if (p.mode === 'pending') {
      if (level.rotation) {
        onMove()
        feedback('tap')
        setState(rotateTrayPiece(state, p.id))
      }
      return
    }
    const cell = cellAt(e.clientX, e.clientY)
    if (cell === null) return
    onMove()
    const next = placePiece(state, p.id, cell)
    if (next === state) {
      setFlash({ cell, ok: false, key: Date.now() })
      feedback('wrong')
      return
    }
    setFlash({ cell, ok: true, key: Date.now() })
    feedback('snap')
    commit(next)
  }

  function onCancel() {
    press.current = null
    setDrag(null)
  }

  const solved = state.tray.length === 0

  return (
    <div className={styles.jigsaw}>
      <div className={styles.boardWrap}>
        <div
          ref={boardRef}
          className={`${styles.board} ${solved ? styles.solved : ''}`}
          style={{ gridTemplateColumns: `repeat(${n}, 1fr)` }}
        >
          {state.board.map((t, i) => (
            <div
              key={flash?.cell === i ? `${i}-${flash.key}` : i}
              className={`${styles.cell} ${t ? '' : styles.empty} ${
                flash?.cell === i ? (flash.ok ? styles.pop : styles.wrong) : ''
              }`}
            >
              {t && <PuzzleTile src={src} n={n} id={t.id} />}
            </div>
          ))}
        </div>
      </div>
      <div ref={trayRef} className={styles.tray} aria-label="Pieces">
        {state.tray.map((t) => (
          <div
            key={t.id}
            data-id={t.id}
            className={`${styles.piece} ${drag?.id === t.id ? styles.lifted : ''}`}
            onPointerDown={(e) => onDown(e, t.id)}
            onPointerMove={onMovePtr}
            onPointerUp={onUp}
            onPointerCancel={onCancel}
            role="button"
            aria-label={level.rotation ? 'Piece: drag to place, tap to rotate' : 'Piece: drag to place'}
          >
            <PuzzleTile src={src} n={n} id={t.id} rot={t.rot} />
          </div>
        ))}
      </div>
      {drag && (
        <div
          className={styles.ghost}
          style={{ width: drag.size, height: drag.size, left: drag.x - drag.size / 2, top: drag.y - drag.size / 2 }}
        >
          <PuzzleTile src={src} n={n} id={drag.id} rot={drag.rot} />
        </div>
      )}
    </div>
  )
})
