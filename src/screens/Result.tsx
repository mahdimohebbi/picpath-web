import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import { DuoButton } from '../components/DuoButton'
import { StarIcon } from '../components/Icons'
import { Mascot } from '../components/Mascot'
import { getLevel } from '../data/levels'
import type { ResultState } from './Game'
import styles from './Result.module.css'

export function Result() {
  const { id } = useParams()
  const level = getLevel(Number(id))
  const result = useLocation().state as ResultState | null
  const navigate = useNavigate()
  if (!level || !result) return <Navigate to="/" replace />

  return (
    <div className={styles.result}>
      <Mascot mood="happy" size={130} />
      <h1>{level.boss ? 'Boss defeated!' : 'Puzzle complete!'}</h1>
      <div className={styles.stars}>
        {[1, 2, 3].map((n) => (
          <StarIcon key={n} size={56} filled={n <= result.stars} />
        ))}
      </div>
      <p>+{result.xp} XP</p>
      <DuoButton block size="lg" onClick={() => navigate('/', { replace: true })}>
        Continue
      </DuoButton>
    </div>
  )
}
