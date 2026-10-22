import type { CSSProperties } from 'react'
import { ChestIcon, CheckIcon, LockIcon, StarIcon } from './Icons'
import styles from './PathNode.module.css'

export type NodeState = 'locked' | 'current' | 'completed'

type Props = {
  state: NodeState
  boss?: boolean
  stars?: number
  /** Unit color pair used for the current node. */
  color?: string
  colorDark?: string
  /** Horizontal offset in px from the path center (zig-zag). */
  offset?: number
  label: string
  onClick?: () => void
}

export function PathNode({ state, boss, stars = 0, color, colorDark, offset = 0, label, onClick }: Props) {
  const style = {
    transform: `translateX(${offset}px)`,
    '--node': color,
    '--node-dark': colorDark,
  } as CSSProperties

  let icon
  if (boss) icon = <ChestIcon size={40} open={state === 'completed'} />
  else if (state === 'locked') icon = <LockIcon size={30} />
  else if (state === 'completed') icon = <CheckIcon size={36} />
  else icon = <StarIcon size={36} />

  return (
    <div className={styles.wrap} style={style}>
      {state === 'current' && <div className={styles.bubble}>START</div>}
      <button
        type="button"
        className={`${styles.node} ${styles[state]} ${boss ? styles.boss : ''}`}
        onClick={onClick}
        disabled={state === 'locked'}
        aria-label={`${label} (${state})`}
      >
        {state === 'current' && <span className={styles.ring} aria-hidden />}
        {icon}
      </button>
      {state === 'completed' && (
        <div className={styles.stars} aria-label={`${stars} stars`}>
          {[1, 2, 3].map((n) => (
            <StarIcon key={n} size={18} filled={n <= stars} />
          ))}
        </div>
      )}
    </div>
  )
}
