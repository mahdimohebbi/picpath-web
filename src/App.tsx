import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Shell } from './components/Shell'
import { Game } from './screens/Game'
import { Path } from './screens/Path'
import { Result } from './screens/Result'

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Shell />}>
          <Route index element={<Path />} />
        </Route>
        <Route path="/play/:id" element={<Game />} />
        <Route path="/result/:id" element={<Result />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  )
}
