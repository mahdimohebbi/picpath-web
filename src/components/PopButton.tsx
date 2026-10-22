import type { ButtonHTMLAttributes } from 'react'
import styles from './PopButton.module.css'

export type PopVariant = 'primary' | 'accent' | 'star' | 'danger' | 'locked' | 'ghost'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: PopVariant
  size?: 'md' | 'lg'
  block?: boolean
}

export function PopButton({ variant = 'primary', size = 'md', block, className, ...rest }: Props) {
  const cls = [styles.btn, styles[variant], styles[size], block && styles.block, className]
    .filter(Boolean)
    .join(' ')
  return <button type="button" className={cls} {...rest} />
}
