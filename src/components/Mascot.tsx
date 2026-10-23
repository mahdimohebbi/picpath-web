import styles from './Mascot.module.css'

export type Mood = 'happy' | 'cheer' | 'sad' | 'sleepy'

type Props = { mood?: Mood; size?: number; className?: string; animated?: boolean }

const INK = '#1e1a2b'
const BODY = '#ff6b57'
const BODY_DEEP = '#e04e3a'
const PAPER = '#fff7ec'

const BODY_PATH = 'M48 36H79L98 55V74A26 26 0 0 1 72 100H48A26 26 0 0 1 22 74V62A26 26 0 0 1 48 36Z'
const STICKER = 9

const LABELS: Record<Mood, string> = {
  happy: 'Pip, smiling',
  cheer: 'Pip, cheering',
  sad: 'Pip, sad',
  sleepy: 'Pip, sleepy',
}

/** Arm drawn as an ink stroke with a body-colored stroke on top, so it reads as an outlined limb. */
function Arm({ d }: { d: string }) {
  return (
    <>
      <path d={d} fill="none" stroke={INK} strokeWidth="12" strokeLinecap="round" />
      <path d={d} fill="none" stroke={BODY} strokeWidth="6" strokeLinecap="round" />
    </>
  )
}

const ARMS: Record<Mood, [string, string]> = {
  happy: ['M25 74 Q16 78 15 87', 'M95 74 Q104 78 105 87'],
  cheer: ['M26 64 Q16 56 13 43', 'M94 64 Q104 56 107 43'],
  sad: ['M25 78 Q21 86 22 94', 'M95 78 Q99 86 98 94'],
  sleepy: ['M25 76 Q18 84 19 92', 'M95 76 Q102 84 101 92'],
}

/**
 * Pip: a chubby picture-tile with a peeled sticker corner and a puzzle-knob cowlick.
 * Signature elements stay fixed across moods; only face and arms change.
 */
export function Mascot({ mood = 'happy', size = 96, className, animated = true }: Props) {
  const [armL, armR] = ARMS[mood]
  const openEyes = mood === 'happy' || mood === 'sad'
  return (
    <svg
      className={`${animated ? styles[mood] : ''} ${className ?? ''}`}
      width={size}
      height={size}
      viewBox="0 0 120 120"
      role="img"
      aria-label={LABELS[mood]}
    >
      <ellipse cx="60" cy="113" rx="34" ry="4.5" fill={INK} opacity="0.13" />
      <g className={styles.body}>
        {/* die-cut sticker border: the whole silhouette traced in paper, behind everything */}
        <g fill={PAPER} stroke={PAPER} strokeLinejoin="round" strokeLinecap="round">
          <ellipse cx="45" cy="103" rx="10" ry="6" strokeWidth={3 + STICKER} />
          <ellipse cx="75" cy="103" rx="10" ry="6" strokeWidth={3 + STICKER} />
          <ellipse cx="45" cy="31" rx="10" ry="9.5" strokeWidth={3.5 + STICKER} transform="rotate(-18 45 31)" />
          <path d={armL} fill="none" strokeWidth={12 + STICKER} />
          <path d={armR} fill="none" strokeWidth={12 + STICKER} />
          <path d={BODY_PATH} strokeWidth={3.5 + STICKER} />
        </g>
        {/* feet, knob and arms sit behind the body */}
        <ellipse cx="45" cy="103" rx="10" ry="6" fill={BODY_DEEP} stroke={INK} strokeWidth="3" />
        <ellipse cx="75" cy="103" rx="10" ry="6" fill={BODY_DEEP} stroke={INK} strokeWidth="3" />
        <ellipse cx="45" cy="31" rx="10" ry="9.5" fill={BODY} stroke={INK} strokeWidth="3.5" transform="rotate(-18 45 31)" />
        <Arm d={armL} />
        <Arm d={armR} />

        <path
          d={BODY_PATH}
          fill={BODY}
          stroke={INK}
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        {/* soft highlight */}
        <path d="M31 60Q33 46 46 43" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity="0.45" />
        {/* peeled sticker corner */}
        <path d="M79 36L98 55L84 53.5Q80.5 53 80 49.5Z" fill={PAPER} stroke={INK} strokeWidth="3" strokeLinejoin="round" />

        <ellipse cx="35" cy="81" rx="5.5" ry="3.5" fill="#ffc53d" opacity="0.95" />
        <ellipse cx="85" cy="81" rx="5.5" ry="3.5" fill="#ffc53d" opacity="0.95" />

        {openEyes ? (
          <g className={styles.eyes}>
            {[47, 73].map((x) => (
              <g key={x}>
                <ellipse cx={x} cy="66" rx="10.5" ry="12.5" fill="#fff" stroke={INK} strokeWidth="3" />
                <circle cx={mood === 'sad' ? x - 1 : x + 1.5} cy={mood === 'sad' ? 71 : 68} r="6.2" fill={INK} />
                <circle cx={mood === 'sad' ? x - 3 : x - 0.5} cy={mood === 'sad' ? 68 : 64.5} r="2.3" fill="#fff" />
              </g>
            ))}
          </g>
        ) : (
          <g fill="none" stroke={INK} strokeWidth="3.5" strokeLinecap="round">
            {mood === 'cheer' ? (
              <path d="M38 69Q47 58 56 69M64 69Q73 58 82 69" />
            ) : (
              <path d="M38 66Q47 73 56 66M64 66Q73 73 82 66" />
            )}
          </g>
        )}

        {mood === 'happy' && <path d="M52 81Q60 91 68 81Z" fill={INK} stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />}
        {mood === 'cheer' && (
          <>
            <path d="M49 79Q60 98 71 79Z" fill={INK} stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
            <ellipse cx="60" cy="88.5" rx="5.5" ry="3" fill="#ff8fa3" />
          </>
        )}
        {mood === 'sad' && (
          <>
            <path d="M37 53L51 49M83 53L69 49" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
            <path d="M52 89Q60 81 68 89" fill="none" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
            <path d="M86 73Q83 79 86 81Q89 79 86 73Z" fill="#7fd8ff" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
          </>
        )}
        {mood === 'sleepy' && <ellipse cx="60" cy="86" rx="3.5" ry="4" fill={INK} />}
      </g>

      {mood === 'cheer' && (
        <g className={styles.sparkles} fill="#ffc53d" stroke={INK} strokeWidth="2" strokeLinejoin="round">
          <path d="M8 22l2.5 5.5 5.5 2.5-5.5 2.5-2.5 5.5-2.5-5.5-5.5-2.5 5.5-2.5z" />
          <path d="M110 16l2 4.5 4.5 2-4.5 2-2 4.5-2-4.5-4.5-2 4.5-2z" />
        </g>
      )}
      {mood === 'sleepy' && (
        <g className={styles.zzz} fill="none" stroke="var(--text, #1e1a2b)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M98 22h8l-8 9h8" />
          <path d="M110 8h6l-6 7h6" />
        </g>
      )}
    </svg>
  )
}
