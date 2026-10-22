import { FlameIcon, HeartIcon, XpIcon } from './Icons'
import styles from './TopStats.module.css'

type Props = {
  streak: number
  xp: number
  hearts: number
  maxHearts: number
  /** Optional "next heart in mm:ss" label shown under the hearts. */
  heartTimer?: string
}

export function TopStats({ streak, xp, hearts, maxHearts, heartTimer }: Props) {
  return (
    <header className={styles.bar}>
      <span className={styles.stat} style={{ color: streak > 0 ? 'var(--orange)' : 'var(--text-muted)' }} title="Day streak">
        <FlameIcon style={{ filter: streak > 0 ? undefined : 'grayscale(1)' }} />
        {streak}
      </span>
      <span className={styles.stat} style={{ color: 'var(--blue)' }} title="Total XP">
        <XpIcon />
        {xp}
      </span>
      <span className={styles.stat} style={{ color: 'var(--red)' }} title={`Hearts (max ${maxHearts})`}>
        <HeartIcon />
        {hearts}
        {heartTimer && hearts < maxHearts && <small className={styles.timer}>{heartTimer}</small>}
      </span>
    </header>
  )
}
