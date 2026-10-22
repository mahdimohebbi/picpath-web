import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mascot } from '../components/Mascot'
import { PathNode, type NodeState } from '../components/PathNode'
import { currentLevelId, isUnlocked, levels, units } from '../data/levels'
import { computeXp, type Level } from '../game/engine'
import { formatMs } from '../store/meta'
import { useProgress } from '../store/progress'
import styles from './Path.module.css'

const AMPLITUDE = 64

export function Path() {
  const stars = useProgress((s) => s.stars)
  const navigate = useNavigate()
  const currentRef = useRef<HTMLDivElement>(null)
  const current = currentLevelId(stars)
  const [open, setOpen] = useState<number | null>(null)

  useEffect(() => {
    currentRef.current?.scrollIntoView({ block: 'center' })
  }, [])

  return (
    <div className={styles.path} onClick={() => setOpen(null)}>
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
                const offset = Math.round(Math.sin((i * Math.PI) / 3) * AMPLITUDE)
                const state: NodeState = stars[l.id]
                  ? 'completed'
                  : isUnlocked(l.id, stars) && l.id === current
                    ? 'current'
                    : 'locked'
                return (
                  <div
                    key={l.id}
                    ref={l.id === current ? currentRef : undefined}
                    className={styles.slot}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <PathNode
                      state={state}
                      boss={l.boss}
                      stars={stars[l.id]}
                      color={unit.color}
                      colorDark={unit.colorDark}
                      offset={offset}
                      label={l.boss ? `Unit ${unit.id} boss` : `Level ${l.id}`}
                      onClick={() => setOpen(open === l.id ? null : l.id)}
                    />
                    {open === l.id && (
                      <div className={styles.pop} style={{ background: unit.color, '--arrow': `calc(50% + ${offset}px)` } as CSSProperties} onClick={(e) => e.stopPropagation()}>
                        <strong>{l.boss ? `Unit ${unit.id} boss` : `Level ${l.id}`}</strong>
                        <span>{describe(l)}</span>
                        <button
                          type="button"
                          className={styles.popBtn}
                          style={{ color: unit.color }}
                          onClick={() => navigate(`/play/${l.id}`)}
                        >
                          {stars[l.id] ? 'Replay' : `Start +${computeXp(3, l.boss)} XP`}
                        </button>
                      </div>
                    )}
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

const MODE_NAMES = { jigsaw: 'Jigsaw', swap: 'Swap', sliding: 'Sliding' } as const

function describe(l: Level): string {
  const parts: string[] = [`${MODE_NAMES[l.mode]} ${l.grid}×${l.grid}`]
  if (l.rotation) parts.push('rotation')
  if (l.limit?.time) parts.push(`${formatMs(l.limit.time * 1000)} limit`)
  if (l.limit?.moves) parts.push(`${l.limit.moves} move limit`)
  return parts.join(' · ')
}
