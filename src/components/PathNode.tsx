import type { CSSProperties } from 'react'
import { ChestIcon, LockIcon, StarIcon } from './Icons'
import styles from './PathNode.module.css'

export type NodeState = 'locked' | 'current' | 'completed'

type Props = {
  state: NodeState
  boss?: boolean
  stars?: number
  /** Unit color used for the current node. */
  color?: string
  /** Horizontal offset in px from the path center (zig-zag). */
  offset?: number
  /** Small tilt in degrees for the sticker look. */
  tilt?: number
  /** Rebuilt picture, shown on completed nodes. */
  image?: string
  label: string
  onClick?: () => void
}

export function PathNode({ state, boss, stars = 0, color, offset = 0, tilt = 0, image, label, onClick }: Props) {
  const style = { transform: `translateX(${offset}px)`, '--node': color } as CSSProperties
  const showImage = state === 'completed' && image

  let icon = null
  if (!showImage) {
    if (boss) icon = <ChestIcon size={44} />
    else if (state === 'locked') icon = <LockIcon size={28} />
    else icon = <StarIcon size={38} />
  }

  return (
    <div className={`${styles.wrap} ${boss ? styles.boss : ''}`} style={style}>
      {state === 'current' && <div className={styles.bubble}>Start</div>}
      <button
        type="button"
        className={`${styles.node} ${styles[state]}`}
        style={{ rotate: `${tilt}deg`, backgroundImage: showImage ? `url(${image})` : undefined }}
        onClick={onClick}
        disabled={state === 'locked'}
        aria-label={`${label} (${state})`}
      >
        {state === 'current' && <span className={styles.ring} aria-hidden />}
        {icon}
        {showImage && boss && (
          <span className={styles.chestBadge}>
            <ChestIcon size={22} open />
          </span>
        )}
      </button>
      {state === 'completed' && (
        <div className={styles.stars} aria-label={`${stars} stars`}>
          {[1, 2, 3].map((n) => (
            <StarIcon key={n} size={15} filled={n <= stars} />
          ))}
        </div>
      )}
    </div>
  )
}
