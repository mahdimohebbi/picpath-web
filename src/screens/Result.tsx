import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import { Confetti } from '../components/Confetti'
import { DuoButton } from '../components/DuoButton'
import { FlameIcon, StarIcon } from '../components/Icons'
import { Mascot } from '../components/Mascot'
import { getLevel, imageUrl, levels } from '../data/levels'
import { useCountUp } from '../lib/useCountUp'
import { formatMs } from '../store/meta'
import type { ResultState } from './Game'
import styles from './Result.module.css'

const STAR_DELAY_MS = 350

const TITLES = ['Puzzle complete!', 'Nice work!', 'Picture perfect!']

export function Result() {
  const { id } = useParams()
  const level = getLevel(Number(id))
  const result = useLocation().state as ResultState | null
  if (!level || !result) return <Navigate to="/" replace />
  return <ResultView levelId={level.id} boss={level.boss} image={level.image} result={result} />
}

function ResultView({ levelId, boss, image, result }: { levelId: number; boss: boolean; image: string; result: ResultState }) {
  const navigate = useNavigate()
  const xp = useCountUp(result.xp, 900, STAR_DELAY_MS * 3 + 200)
  const last = levelId === levels[levels.length - 1].id
  const title = boss ? 'Chest unlocked!' : TITLES[result.stars - 1]

  return (
    <div className={styles.result}>
      <Confetti />
      <div className={styles.hero}>
        <img className={styles.picture} src={imageUrl(image)} alt="Completed picture" />
        <Mascot className={styles.mascot} mood="happy" size={86} />
      </div>

      <h1 className={styles.title}>{last ? 'You finished PicPath!' : title}</h1>

      <div className={styles.stars} aria-label={`${result.stars} of 3 stars`}>
        {[1, 2, 3].map((n) => (
          <span key={n} className={styles.star} style={{ animationDelay: `${n * STAR_DELAY_MS}ms` }}>
            <StarIcon size={n === 2 ? 68 : 54} filled={n <= result.stars} />
          </span>
        ))}
      </div>

      <div className={styles.cards}>
        <Card label={boss ? 'Boss XP ×2' : 'Total XP'} color="var(--gold)" value={`+${xp}`} />
        <Card label="Time" color="var(--blue)" value={formatMs(result.seconds * 1000)} />
        <Card label="Moves" color="var(--green)" value={String(result.moves)} />
      </div>

      {result.hints > 0 && (
        <p className={styles.note}>
          {result.hints} hint{result.hints > 1 ? 's' : ''} used
        </p>
      )}
      {result.streakUp && (
        <p className={styles.streak}>
          <FlameIcon size={28} /> {result.streak} day streak!
        </p>
      )}

      <div className={styles.actions}>
        <DuoButton block size="lg" onClick={() => navigate('/', { replace: true })}>
          Continue
        </DuoButton>
        <DuoButton block variant="ghost" onClick={() => navigate(`/play/${levelId}`, { replace: true })}>
          Replay
        </DuoButton>
      </div>
    </div>
  )
}

function Card({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className={styles.card} style={{ borderColor: color, background: color }}>
      <small>{label}</small>
      <strong style={{ color }}>{value}</strong>
    </div>
  )
}
