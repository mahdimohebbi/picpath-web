import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { MAX_HEARTS, dayKey, formatMs, nextHeartIn, visibleStreak } from '../store/meta'
import { useProgress } from '../store/progress'
import { BottomNav } from './BottomNav'
import { TopStats } from './TopStats'
import styles from './Shell.module.css'

/** Top stats + bottom nav around the Path, Gallery and Profile screens. */
export function Shell() {
  const { xp, hearts, heartsAt, streak, lastDay, syncHearts } = useProgress()
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    syncHearts()
    const t = setInterval(() => {
      setNow(Date.now())
      syncHearts()
    }, 1000)
    return () => clearInterval(t)
  }, [syncHearts])

  const wait = nextHeartIn({ hearts, heartsAt }, now)
  return (
    <div className={styles.shell}>
      <TopStats
        streak={visibleStreak({ streak, lastDay }, dayKey(new Date(now)))}
        xp={xp}
        hearts={hearts}
        maxHearts={MAX_HEARTS}
        heartTimer={wait ? formatMs(wait) : undefined}
      />
      <main className={styles.main}>
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
