import type { ButtonHTMLAttributes } from 'react'
import styles from './DuoButton.module.css'

export type DuoVariant = 'green' | 'blue' | 'gold' | 'red' | 'locked' | 'ghost'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: DuoVariant
  size?: 'md' | 'lg'
  block?: boolean
}

export function DuoButton({ variant = 'green', size = 'md', block, className, ...rest }: Props) {
  const cls = [styles.btn, styles[variant], styles[size], block && styles.block, className]
    .filter(Boolean)
    .join(' ')
  return <button type="button" className={cls} {...rest} />
}
