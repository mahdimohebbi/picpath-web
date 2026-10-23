import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './theme.css'
import App from './App'
import { applyTheme } from './lib/theme'
import { useProgress } from './store/progress'

applyTheme(useProgress.getState().theme)
useProgress.subscribe((s, prev) => s.theme !== prev.theme && applyTheme(s.theme))
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => applyTheme(useProgress.getState().theme))

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
