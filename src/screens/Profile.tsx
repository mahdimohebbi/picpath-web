import { useState } from 'react'
import { PopButton } from '../components/PopButton'
import { FlameIcon, HeartIcon, PuzzleIcon, StarIcon, XpIcon } from '../components/Icons'
import { Mascot } from '../components/Mascot'
import { levels } from '../data/levels'
import { dayKey, visibleStreak } from '../store/meta'
import { useProgress } from '../store/progress'
import styles from './Profile.module.css'

export function Profile() {
  const { stars, xp, hearts, streak, lastDay, sound, toggleSound, reset } = useProgress()
  const [confirm, setConfirm] = useState(false)
  const done = Object.keys(stars).length
  const totalStars = Object.values(stars).reduce((a, b) => a + b, 0)

  return (
    <div className={styles.profile}>
      <div className={styles.head}>
        <Mascot size={96} />
        <div>
          <h1>Puzzler</h1>
          <p>{done === levels.length ? 'PicPath master' : `Unit ${levels[Math.min(done, levels.length - 1)].unit} explorer`}</p>
        </div>
      </div>

      <h2 className={styles.section}>Statistics</h2>
      <div className={styles.stats}>
        <Stat icon={<FlameIcon size={28} />} value={visibleStreak({ streak, lastDay }, dayKey(new Date()))} label="Day streak" />
        <Stat icon={<XpIcon size={28} />} value={xp} label="Total XP" />
        <Stat icon={<PuzzleIcon size={28} style={{ color: 'var(--primary)' }} />} value={`${done}/${levels.length}`} label="Levels" />
        <Stat icon={<StarIcon size={28} />} value={`${totalStars}/${levels.length * 3}`} label="Stars" />
        <Stat icon={<HeartIcon size={28} />} value={hearts} label="Hearts" />
      </div>

      <h2 className={styles.section}>Settings</h2>
      <label className={styles.row}>
        <span>Sound effects</span>
        <input type="checkbox" role="switch" className={styles.switch} checked={sound} onChange={toggleSound} />
      </label>

      <div className={styles.danger}>
        {confirm ? (
          <>
            <p>This erases all stars, XP and streak on this device. Are you sure?</p>
            <div className={styles.confirmRow}>
              <PopButton variant="ghost" onClick={() => setConfirm(false)}>
                Cancel
              </PopButton>
              <PopButton
                variant="danger"
                onClick={() => {
                  reset()
                  setConfirm(false)
                }}
              >
                Reset
              </PopButton>
            </div>
          </>
        ) : (
          <PopButton block variant="ghost" className={styles.resetBtn} onClick={() => setConfirm(true)}>
            Reset progress
          </PopButton>
        )}
      </div>

      <p className={styles.credits}>
        Photos from Lorem Picsum / Unsplash ·{' '}
        <a href="https://github.com/mahdimohebbi/picpath-web/blob/main/CREDITS.md" target="_blank" rel="noreferrer">
          Credits
        </a>
      </p>
    </div>
  )
}

function Stat({ icon, value, label }: { icon: React.ReactNode; value: number | string; label: string }) {
  return (
    <div className={styles.stat}>
      {icon}
      <div>
        <strong>{value}</strong>
        <small>{label}</small>
      </div>
    </div>
  )
}
