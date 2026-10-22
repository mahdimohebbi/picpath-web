import { NavLink } from 'react-router-dom'
import { GalleryIcon, PathIcon, ProfileIcon } from './Icons'
import styles from './BottomNav.module.css'

const items = [
  { to: '/', label: 'Path', Icon: PathIcon },
  { to: '/gallery', label: 'Gallery', Icon: GalleryIcon },
  { to: '/profile', label: 'Profile', Icon: ProfileIcon },
]

export function BottomNav() {
  return (
    <nav className={styles.nav}>
      {items.map(({ to, label, Icon }) => (
        <NavLink key={to} to={to} end className={({ isActive }) => `${styles.item} ${isActive ? styles.active : ''}`}>
          <Icon size={26} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
