import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement> & { size?: number }

function svg(size: number, props: SVGProps<SVGSVGElement>) {
  return { width: size, height: size, viewBox: '0 0 24 24', 'aria-hidden': true, ...props }
}

export function FlameIcon({ size = 24, ...p }: IconProps) {
  return (
    <svg {...svg(size, p)}>
      <path fill="#ff9600" d="M12 2c1 4 6 6 6 12a6 6 0 0 1-12 0c0-3 2-5 3-6 0 2 1 3 2 3 0-4-1-6 1-9z" />
      <path fill="#ffc800" d="M12 12c1 2 3 3 3 5a3 3 0 0 1-6 0c0-1.5 1-2.5 1.5-3 .2 1 .8 1.5 1.5 1.5 0-1.5-.5-2.5 0-3.5z" />
    </svg>
  )
}

export function HeartIcon({ size = 24, ...p }: IconProps) {
  return (
    <svg {...svg(size, p)}>
      <path fill="#ff4b4b" d="M12 21s-8-5.2-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.8-8 11-8 11z" />
      <path fill="#fff" opacity=".5" d="M7.5 7.5a2 2 0 0 1 2-1" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export function XpIcon({ size = 24, ...p }: IconProps) {
  return (
    <svg {...svg(size, p)}>
      <path fill="#1cb0f6" d="M12 2l8 5v10l-8 5-8-5V7z" />
      <path fill="#fff" d="M13 6l-4 7h3l-1 5 4-7h-3z" />
    </svg>
  )
}

export function StarIcon({ size = 24, filled = true, ...p }: IconProps & { filled?: boolean }) {
  return (
    <svg {...svg(size, p)}>
      <path
        fill={filled ? '#ffc800' : 'var(--locked)'}
        stroke={filled ? '#e5a500' : 'var(--locked-dark)'}
        strokeWidth="1.5"
        strokeLinejoin="round"
        d="M12 2.5l2.9 6 6.6.8-4.9 4.5 1.3 6.5L12 17l-5.9 3.3 1.3-6.5-4.9-4.5 6.6-.8z"
      />
    </svg>
  )
}

export function LockIcon({ size = 24, ...p }: IconProps) {
  return (
    <svg {...svg(size, p)}>
      <rect x="5" y="10" width="14" height="11" rx="3" fill="currentColor" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" fill="none" stroke="currentColor" strokeWidth="2.5" />
    </svg>
  )
}

export function CheckIcon({ size = 24, ...p }: IconProps) {
  return (
    <svg {...svg(size, p)}>
      <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function ChestIcon({ size = 24, open = false, ...p }: IconProps & { open?: boolean }) {
  return (
    <svg {...svg(size, p)}>
      {open ? (
        <path fill="#a0632b" d="M3 6l3-3h12l3 3v3H3z" />
      ) : (
        <path fill="#c67c3b" d="M3 9a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5v2H3z" />
      )}
      <rect x="3" y="11" width="18" height="9" rx="2" fill="#a0632b" />
      <rect x="3" y="10" width="18" height="2.5" fill="#ffc800" />
      <rect x="10" y="9" width="4" height="6" rx="1" fill="#ffc800" />
    </svg>
  )
}

export function PuzzleIcon({ size = 24, ...p }: IconProps) {
  return (
    <svg {...svg(size, p)}>
      <path
        fill="currentColor"
        d="M4 7h4a2.5 2.5 0 1 1 5 0h4v4a2.5 2.5 0 1 1 0 5v4h-4a2.5 2.5 0 1 0-5 0H4v-4a2.5 2.5 0 1 0 0-5z"
      />
    </svg>
  )
}

export function PathIcon({ size = 24, ...p }: IconProps) {
  return (
    <svg {...svg(size, p)}>
      <path d="M7 20c0-4 10-3 10-8S7 8 7 4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="1 4" />
      <circle cx="7" cy="20" r="2.5" fill="currentColor" />
      <circle cx="7" cy="4" r="2.5" fill="currentColor" />
    </svg>
  )
}

export function GalleryIcon({ size = 24, ...p }: IconProps) {
  return (
    <svg {...svg(size, p)}>
      <rect x="3" y="4" width="18" height="16" rx="3" fill="none" stroke="currentColor" strokeWidth="2.5" />
      <path d="M5 18l5-6 3 4 2-2 4 4z" fill="currentColor" />
      <circle cx="16" cy="9" r="2" fill="currentColor" />
    </svg>
  )
}

export function ProfileIcon({ size = 24, ...p }: IconProps) {
  return (
    <svg {...svg(size, p)}>
      <circle cx="12" cy="8" r="4" fill="currentColor" />
      <path d="M4 21a8 8 0 0 1 16 0z" fill="currentColor" />
    </svg>
  )
}

export function BulbIcon({ size = 24, ...p }: IconProps) {
  return (
    <svg {...svg(size, p)}>
      <path fill="#ffc800" d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z" />
      <rect x="8.5" y="18" width="7" height="3" rx="1.5" fill="#afafaf" />
    </svg>
  )
}

export function EyeIcon({ size = 24, ...p }: IconProps) {
  return (
    <svg {...svg(size, p)}>
      <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" fill="none" stroke="currentColor" strokeWidth="2.2" />
      <circle cx="12" cy="12" r="3.2" fill="currentColor" />
    </svg>
  )
}

export function CloseIcon({ size = 24, ...p }: IconProps) {
  return (
    <svg {...svg(size, p)}>
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}
