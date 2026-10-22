import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mascot } from '../components/Mascot'
import { PathNode, type NodeState } from '../components/PathNode'
import { currentLevelId, isUnlocked, levels, units } from '../data/levels'
import { useProgress } from '../store/progress'
import styles from './Path.module.css'

const AMPLITUDE = 64

export function Path() {
  const stars = useProgress((s) => s.stars)
  const navigate = useNavigate()
  const currentRef = useRef<HTMLDivElement>(null)
  const current = currentLevelId(stars)

  useEffect(() => {
    currentRef.current?.scrollIntoView({ block: 'center' })
  }, [])

  return (
    <div className={styles.path}>
      {units.map((unit) => (
        <section key={unit.id} className={styles.unit}>
          <div className={styles.banner} style={{ background: unit.color, boxShadow: `0 4px 0 ${unit.colorDark}` }}>
            <small>Unit {unit.id}</small>
            <h2>{unit.title}</h2>
          </div>
          <div className={styles.nodes}>
            {levels
              .filter((l) => l.unit === unit.id)
              .map((l, i) => {
                const state: NodeState = stars[l.id]
                  ? 'completed'
                  : isUnlocked(l.id, stars) && l.id === current
                    ? 'current'
                    : 'locked'
                return (
                  <div key={l.id} ref={l.id === current ? currentRef : undefined} className={styles.slot}>
                    <PathNode
                      state={state}
                      boss={l.boss}
                      stars={stars[l.id]}
                      color={unit.color}
                      colorDark={unit.colorDark}
                      offset={Math.round(Math.sin((i * Math.PI) / 3) * AMPLITUDE)}
                      label={l.boss ? `Unit ${unit.id} boss` : `Level ${l.id}`}
                      onClick={() => navigate(`/play/${l.id}`)}
                    />
                  </div>
                )
              })}
            {/* sits left, opposite the path's rightward bulge */}
            <Mascot className={styles.mascot} mood="happy" size={88} />
          </div>
        </section>
      ))}
    </div>
  )
}
