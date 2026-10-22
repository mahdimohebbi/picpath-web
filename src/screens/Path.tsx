import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mascot } from '../components/Mascot'
import { PathNode, type NodeState } from '../components/PathNode'
import { currentLevelId, imageUrl, isUnlocked, levels, units } from '../data/levels'
import { computeXp, type Level } from '../game/engine'
import { formatMs } from '../store/meta'
import { useProgress } from '../store/progress'
import styles from './Path.module.css'

const AMPLITUDE = 64
const SLOT = 134
/** Vertical center of a node inside its slot. */
const NODE_Y = 56
const TRACK_W = AMPLITUDE * 2 + 120
const TILTS = [-4, 3, -2, 4, -3, 2]

const offsetAt = (i: number) => Math.round(Math.sin((i * Math.PI) / 3) * AMPLITUDE)

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
      {units.map((unit) => {
        const unitLevels = levels.filter((l) => l.unit === unit.id)
        const done = unitLevels.filter((l) => stars[l.id]).length
        return (
          <section key={unit.id} className={styles.unit} style={{ '--unit': unit.color } as CSSProperties}>
            <div className={styles.banner}>
              <div>
                <small>Unit {unit.id}</small>
                <h2>{unit.title}</h2>
              </div>
              <span className={styles.count}>
                {done}/{unitLevels.length}
              </span>
            </div>
            <div className={styles.nodes}>
              <div className={styles.track} style={{ width: TRACK_W, height: unitLevels.length * SLOT }}>
                <Trail levels={unitLevels} stars={stars} />
                {unitLevels.map((l, i) => {
                  const offset = offsetAt(i)
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
                        offset={offset}
                        tilt={TILTS[i % TILTS.length]}
                        image={imageUrl(l.image)}
                        label={l.boss ? `Unit ${unit.id} boss` : `Level ${l.id}`}
                        onClick={() => setOpen(open === l.id ? null : l.id)}
                      />
                      {open === l.id && (
                        <div
                          className={styles.pop}
                          style={{ '--arrow': `calc(50% + ${offset}px)` } as CSSProperties}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <strong>{l.boss ? `Unit ${unit.id} boss` : `Level ${l.id}`}</strong>
                          <span>{describe(l)}</span>
                          <button type="button" className={styles.popBtn} onClick={() => navigate(`/play/${l.id}`)}>
                            {stars[l.id] ? 'Replay' : `Start · +${computeXp(3, l.boss)} XP`}
                          </button>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
              {/* sits left, opposite the path's rightward bulge */}
              <Mascot className={styles.mascot} mood="happy" size={84} />
            </div>
          </section>
        )
      })}
    </div>
  )
}

/** Dotted trail between nodes; segments fill with the unit color once the level above is done. */
function Trail({ levels: ls, stars }: { levels: Level[]; stars: Record<number, number> }) {
  const x = (i: number) => TRACK_W / 2 + offsetAt(i)
  const y = (i: number) => i * SLOT + NODE_Y
  return (
    <svg className={styles.trail} width={TRACK_W} height={ls.length * SLOT} aria-hidden>
      {ls.slice(0, -1).map((l, i) => (
        <path
          key={l.id}
          d={`M${x(i)} ${y(i)} C${x(i)} ${y(i) + SLOT / 2} ${x(i + 1)} ${y(i + 1) - SLOT / 2} ${x(i + 1)} ${y(i + 1)}`}
          className={stars[l.id] ? styles.trailDone : undefined}
        />
      ))}
    </svg>
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
