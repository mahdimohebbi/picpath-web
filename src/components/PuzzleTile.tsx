import type { CSSProperties } from 'react'
import type { Rot } from '../game/engine'
import styles from './PuzzleTile.module.css'

type Props = {
  src: string
  n: number
  /** Solved cell index; picks which slice of the image to show. */
  id: number
  rot?: Rot
  className?: string
  style?: CSSProperties
}

/** One slice of the picture, cut with background-position. */
export function PuzzleTile({ src, n, id, rot = 0, className, style }: Props) {
  const col = id % n
  const row = Math.floor(id / n)
  const step = 100 / (n - 1)
  return (
    <div
      className={`${styles.tile} ${className ?? ''}`}
      style={{
        backgroundImage: `url(${src})`,
        backgroundSize: `${n * 100}%`,
        backgroundPosition: `${col * step}% ${row * step}%`,
        transform: rot ? `rotate(${rot * 90}deg)` : undefined,
        ...style,
      }}
    />
  )
}
