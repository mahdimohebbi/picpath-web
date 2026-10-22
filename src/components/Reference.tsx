import { useEffect, useState } from 'react'
import type { ReferenceMode } from '../game/engine'
import { EyeIcon } from './Icons'
import styles from './Reference.module.css'

const TIMED_MS = 5000

/** Small preview of the finished picture; visibility depends on the level's reference mode. */
export function Reference({ src, mode }: { src: string; mode: ReferenceMode }) {
  const [peek, setPeek] = useState(false)
  const [expired, setExpired] = useState(false)

  useEffect(() => {
    if (mode !== 'timed') return
    const t = setTimeout(() => setExpired(true), TIMED_MS)
    return () => clearTimeout(t)
  }, [mode])

  const visible = mode === 'full' || mode === 'half' || (mode === 'timed' && !expired) || (mode === 'toggle' && peek)
  const opacity = mode === 'half' ? 0.5 : 1

  return (
    <div className={styles.ref}>
      <img src={src} alt="Reference" style={{ opacity: visible ? opacity : 0 }} draggable={false} />
      {mode === 'toggle' && (
        <button
          type="button"
          className={styles.peek}
          aria-label="Hold to peek at the picture"
          onPointerDown={() => setPeek(true)}
          onPointerUp={() => setPeek(false)}
          onPointerLeave={() => setPeek(false)}
          onPointerCancel={() => setPeek(false)}
          style={{ opacity: peek ? 0 : 1 }}
        >
          <EyeIcon />
          <small>Hold</small>
        </button>
      )}
      {mode === 'timed' && expired && <span className={styles.hidden}>?</span>}
      {mode === 'timed' && !expired && <span className={styles.countdown} />}
    </div>
  )
}
