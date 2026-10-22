import { useCallback, useEffect, useRef, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { PopButton } from '../components/PopButton'
import { BulbIcon, CloseIcon, HeartIcon } from '../components/Icons'
import { Mascot } from '../components/Mascot'
import { Reference } from '../components/Reference'
import { JigsawBoard } from '../components/boards/JigsawBoard'
import { SlidingBoard } from '../components/boards/SlidingBoard'
import { SwapBoard } from '../components/boards/SwapBoard'
import type { BoardHandle, BoardProps } from '../components/boards/types'
import { getLevel, getUnit, imageUrl, isUnlocked } from '../data/levels'
import { HINTS_PER_LEVEL, computeStars, computeXp, isOverLimit, type Level, type Mode } from '../game/engine'
import { feedback } from '../lib/feedback'
import { useImage } from '../lib/useImage'
import { formatMs, nextHeartIn, regenHearts } from '../store/meta'
import { useProgress } from '../store/progress'
import styles from './Game.module.css'

const boards: Record<Mode, React.ForwardRefExoticComponent<BoardProps & React.RefAttributes<BoardHandle>>> = {
  jigsaw: JigsawBoard,
  swap: SwapBoard,
  sliding: SlidingBoard,
}

export interface ResultState {
  stars: number
  xp: number
  moves: number
  seconds: number
  hints: number
  firstClear: boolean
  streak: number
  /** True when this win extended the streak (first win today). */
  streakUp: boolean
}

export function Game() {
  const { id } = useParams()
  const level = getLevel(Number(id))
  const stars = useProgress((s) => s.stars)
  const [attempt, setAttempt] = useState(0)
  if (!level || !isUnlocked(level.id, stars)) return <Navigate to="/" replace />
  return <Play key={`${level.id}-${attempt}`} level={level} onRetry={() => setAttempt((a) => a + 1)} />
}

function Play({ level, onRetry }: { level: Level; onRetry: () => void }) {
  const navigate = useNavigate()
  const unit = getUnit(level.unit)
  const src = imageUrl(level.image)
  const loaded = useImage(src)
  const { hearts, heartsAt, completeLevel, failLevel } = useProgress()
  const boardRef = useRef<BoardHandle>(null)

  const [moves, setMoves] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const [hints, setHints] = useState(0)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState<'playing' | 'failed' | 'won'>('playing')
  // Out of hearts blocks only levels that can cost a heart.
  const [blocked] = useState(() => !!level.limit && regenHearts({ hearts, heartsAt }, Date.now()).hearts === 0)

  const playing = loaded && status === 'playing' && !blocked

  useEffect(() => {
    if (!playing) return
    const t = setInterval(() => {
      if (document.visibilityState === 'visible') setSeconds((s) => s + 1)
    }, 1000)
    return () => clearInterval(t)
  }, [playing])

  useEffect(() => {
    if (status === 'playing' && isOverLimit(level, { moves, seconds })) {
      setStatus('failed')
      failLevel()
      feedback('fail')
    }
  }, [level, moves, seconds, status, failLevel])

  const onMove = useCallback(() => setMoves((m) => m + 1), [])
  const onProgress = useCallback((locked: number, total: number) => setProgress(locked / total), [])

  const finalStats = useRef({ moves, seconds, hints })
  finalStats.current = { moves, seconds, hints }

  const onSolved = useCallback(() => {
    setStatus('won')
    feedback('win')
    const s = finalStats.current
    const stars = computeStars(level, s)
    const xp = computeXp(stars, level.boss)
    const before = useProgress.getState()
    const firstClear = !before.stars[level.id]
    completeLevel(level.id, stars, xp)
    const after = useProgress.getState()
    const result: ResultState = { stars, xp, firstClear, streak: after.streak, streakUp: after.lastDay !== before.lastDay, ...s }
    setTimeout(() => navigate(`/result/${level.id}`, { replace: true, state: result }), 900)
  }, [level, completeLevel, navigate])

  function applyHint() {
    if (hints >= HINTS_PER_LEVEL || !playing) return
    if (boardRef.current?.hint()) setHints((h) => h + 1)
  }

  if (blocked) {
    return (
      <div className={styles.overlayPage}>
        <Mascot mood="sad" size={120} />
        <h2>Out of hearts</h2>
        <p className={styles.muted}>
          This level has a {level.limit?.time ? 'time' : 'move'} limit. Next heart in{' '}
          {formatMs(nextHeartIn({ hearts, heartsAt }, Date.now()))}.
        </p>
        <PopButton block size="lg" onClick={() => navigate('/')}>
          Back to path
        </PopButton>
      </div>
    )
  }

  const Board = boards[level.mode]
  const limitLeft = level.limit?.time ? level.limit.time - seconds : undefined
  const movesLeft = level.limit?.moves ? level.limit.moves - moves : undefined

  return (
    <div className={styles.game}>
      <header className={styles.header}>
        <button type="button" className={styles.close} onClick={() => navigate('/')} aria-label="Quit level">
          <CloseIcon />
        </button>
        <div className={styles.progress}>
          <div style={{ width: `${progress * 100}%`, background: unit.color }} />
        </div>
        {level.limit && (
          <span className={styles.hearts}>
            <HeartIcon size={22} />
            {hearts}
          </span>
        )}
      </header>

      <div className={styles.info}>
        <Reference src={src} mode={level.reference} />
        <dl className={styles.stats}>
          <div>
            <dt>Moves</dt>
            <dd className={movesLeft !== undefined && movesLeft <= 10 ? styles.warn : ''}>
              {moves}
              <small>/{level.limit?.moves ?? level.parMoves}</small>
            </dd>
          </div>
          <div>
            <dt>Time</dt>
            <dd className={limitLeft !== undefined && limitLeft <= 30 ? styles.warn : ''}>
              {formatMs((limitLeft ?? seconds) * 1000)}
              {limitLeft === undefined && <small>/{formatMs(level.parTime * 1000)}</small>}
            </dd>
          </div>
        </dl>
        <button
          type="button"
          className={styles.hint}
          onClick={applyHint}
          disabled={!playing || hints >= HINTS_PER_LEVEL}
          aria-label={`Use a hint (${HINTS_PER_LEVEL - hints} left)`}
        >
          <BulbIcon size={28} />
          <span>{HINTS_PER_LEVEL - hints}</span>
        </button>
      </div>

      {loaded ? (
        <Board
          ref={boardRef}
          level={level}
          src={src}
          disabled={!playing}
          onMove={onMove}
          onProgress={onProgress}
          onSolved={onSolved}
        />
      ) : (
        <div className={styles.loading}>Loading…</div>
      )}

      {status === 'failed' && (
        <div className={styles.overlay}>
          <div className={styles.sheet}>
            <Mascot mood="sad" size={100} />
            <h2>{level.limit?.time ? "Time's up!" : 'Out of moves!'}</h2>
            <p className={styles.muted}>You lost a heart. {hearts > 0 ? 'Give it another go?' : 'Rest a bit and come back.'}</p>
            {hearts > 0 && (
              <PopButton block size="lg" onClick={onRetry}>
                Try again
              </PopButton>
            )}
            <PopButton block variant="ghost" onClick={() => navigate('/')}>
              Back to path
            </PopButton>
          </div>
        </div>
      )}
    </div>
  )
}
