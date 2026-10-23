import type { Theme } from '../store/progress'

const THEME_COLOR = { light: '#fff7ec', dark: '#17131f' }

/** Sets data-theme on <html>; "system" removes it so prefers-color-scheme decides. */
export function applyTheme(theme: Theme) {
  const root = document.documentElement
  if (theme === 'system') delete root.dataset.theme
  else root.dataset.theme = theme
  const dark = theme === 'dark' || (theme === 'system' && matchMedia('(prefers-color-scheme: dark)').matches)
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? THEME_COLOR.dark : THEME_COLOR.light)
}
