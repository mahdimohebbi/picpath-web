import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Shell } from './components/Shell'
import { Path } from './screens/Path'

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Shell />}>
          <Route index element={<Path />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  )
}
