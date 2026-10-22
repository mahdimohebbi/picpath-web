import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Shell } from './components/Shell'
import { Gallery } from './screens/Gallery'
import { Game } from './screens/Game'
import { Path } from './screens/Path'
import { Profile } from './screens/Profile'
import { Result } from './screens/Result'

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Shell />}>
          <Route index element={<Path />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        <Route path="/play/:id" element={<Game />} />
        <Route path="/result/:id" element={<Result />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  )
}
