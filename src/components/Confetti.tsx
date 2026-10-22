import { useMemo, type CSSProperties } from 'react'
import styles from './Confetti.module.css'

const COLORS = ['#ff6b57', '#2ec4b6', '#ffc53d', '#8e7cff', '#ff5fa2', '#1e1a2b']

/** One-shot DOM confetti burst; pieces fall once and stay hidden afterwards. */
export function Confetti({ count = 90 }: { count?: number }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 0.6,
        duration: 2.2 + Math.random() * 1.6,
        drift: (Math.random() - 0.5) * 160,
        spin: (Math.random() < 0.5 ? -1 : 1) * (360 + Math.random() * 720),
        color: COLORS[i % COLORS.length],
        w: 6 + Math.random() * 6,
        round: Math.random() < 0.3,
      })),
    [count],
  )
  return (
    <div className={styles.confetti} aria-hidden>
      {pieces.map((p, i) => (
        <span
          key={i}
          style={
            {
              left: `${p.left}%`,
              width: p.w,
              height: p.round ? p.w : p.w * 1.6,
              borderRadius: p.round ? '50%' : 2,
              background: p.color,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
              '--drift': `${p.drift}px`,
              '--spin': `${p.spin}deg`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  )
}
