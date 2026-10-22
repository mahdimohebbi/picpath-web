import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DuoButton } from '../components/DuoButton'
import { CloseIcon, LockIcon, StarIcon } from '../components/Icons'
import { imageUrl, levels } from '../data/levels'
import type { Level } from '../game/engine'
import { useProgress } from '../store/progress'
import styles from './Gallery.module.css'

export function Gallery() {
  const stars = useProgress((s) => s.stars)
  const navigate = useNavigate()
  const [open, setOpen] = useState<Level | null>(null)
  const done = levels.filter((l) => stars[l.id]).length

  return (
    <div className={styles.gallery}>
      <h1>Gallery</h1>
      <p className={styles.sub}>
        {done} of {levels.length} pictures rebuilt
      </p>
      <div className={styles.grid}>
        {levels.map((l) =>
          stars[l.id] ? (
            <button key={l.id} type="button" className={styles.item} onClick={() => setOpen(l)}>
              <img src={imageUrl(l.image)} alt={`Picture ${l.id}`} loading="lazy" decoding="async" />
              <span className={styles.badge}>
                {[1, 2, 3].map((n) => (
                  <StarIcon key={n} size={14} filled={n <= stars[l.id]} />
                ))}
              </span>
            </button>
          ) : (
            <div key={l.id} className={`${styles.item} ${styles.locked}`} aria-label={`Picture ${l.id} locked`}>
              <LockIcon size={22} />
              <small>{l.id}</small>
            </div>
          ),
        )}
      </div>

      {open && (
        <div className={styles.viewer} role="dialog" aria-label={`Picture ${open.id}`} onClick={() => setOpen(null)}>
          <button type="button" className={styles.close} aria-label="Close">
            <CloseIcon />
          </button>
          <img src={imageUrl(open.image)} alt={`Picture ${open.id}`} onClick={(e) => e.stopPropagation()} />
          <div className={styles.viewerActions} onClick={(e) => e.stopPropagation()}>
            <DuoButton block size="lg" onClick={() => navigate(`/play/${open.id}`)}>
              Play again
            </DuoButton>
          </div>
        </div>
      )}
    </div>
  )
}
