export type Mood = 'happy' | 'sad'

type Props = { mood?: Mood; size?: number; className?: string }

/** Pip: an original puzzle-piece character. */
export function Mascot({ mood = 'happy', size = 96, className }: Props) {
  const body = mood === 'happy' ? '#58cc02' : '#1cb0f6'
  const shade = mood === 'happy' ? '#58a700' : '#1899d6'
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 100 100"
      role="img"
      aria-label={mood === 'happy' ? 'Happy puzzle piece' : 'Sad puzzle piece'}
    >
      <path
        fill={shade}
        d="M20 30h18a12 12 0 1 1 24 0h18v18a12 12 0 1 1 0 24v18H20V72a12 12 0 1 0 0-24z"
        transform="translate(0 4)"
      />
      <path fill={body} d="M20 30h18a12 12 0 1 1 24 0h18v18a12 12 0 1 1 0 24v18H20V72a12 12 0 1 0 0-24z" />
      <ellipse cx="38" cy="54" rx="6" ry={mood === 'happy' ? 7 : 6} fill="#fff" />
      <ellipse cx="62" cy="54" rx="6" ry={mood === 'happy' ? 7 : 6} fill="#fff" />
      <circle cx={mood === 'happy' ? 39 : 37} cy={mood === 'happy' ? 55 : 57} r="3.2" fill="#3c3c3c" />
      <circle cx={mood === 'happy' ? 63 : 61} cy={mood === 'happy' ? 55 : 57} r="3.2" fill="#3c3c3c" />
      {mood === 'happy' ? (
        <>
          <path d="M40 68q10 10 20 0" fill="#fff" stroke="#3c3c3c" strokeWidth="3" strokeLinecap="round" />
          <circle cx="30" cy="64" r="4" fill="#ff86d0" opacity=".6" />
          <circle cx="70" cy="64" r="4" fill="#ff86d0" opacity=".6" />
        </>
      ) : (
        <>
          <path d="M42 74q8-7 16 0" fill="none" stroke="#3c3c3c" strokeWidth="3" strokeLinecap="round" />
          <path d="M31 45l12 4M69 45l-12 4" stroke="#3c3c3c" strokeWidth="3" strokeLinecap="round" />
          <path d="M33 62q-2 5 0 7q2-2 0-7z" fill="#7fd4ff" />
        </>
      )}
    </svg>
  )
}
