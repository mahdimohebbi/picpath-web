import type { Level } from '../../game/engine'

export interface BoardHandle {
  /** Applies one hint; false when nothing could be done. */
  hint(): boolean
}

export interface BoardProps {
  level: Level
  src: string
  disabled: boolean
  onMove(): void
  onProgress(locked: number, total: number): void
  onSolved(): void
}
