import { DuoButton } from './components/DuoButton'
import { Mascot } from './components/Mascot'
import { PathNode } from './components/PathNode'
import { TopStats } from './components/TopStats'

export default function App() {
  return (
    <main style={{ maxWidth: 'var(--max-width)', margin: '0 auto', textAlign: 'center' }}>
      <TopStats streak={3} xp={120} hearts={4} maxHearts={5} heartTimer="12:30" />
      <div style={{ padding: 24, display: 'grid', gap: 40, justifyItems: 'center' }}>
        <Mascot />
        <PathNode state="completed" stars={2} label="Level 1" offset={-40} />
        <PathNode state="current" label="Level 2" offset={30} />
        <PathNode state="locked" label="Level 3" />
        <PathNode state="locked" boss label="Boss" />
        <DuoButton block size="lg">Continue</DuoButton>
      </div>
    </main>
  )
}
