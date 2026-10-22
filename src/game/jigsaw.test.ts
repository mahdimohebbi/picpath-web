import { describe, expect, it } from 'vitest'
import { canPlace, createJigsaw, isJigsawSolved, jigsawHint, placePiece, rotateTrayPiece } from './jigsaw'
import { mulberry32 } from './rng'

describe('jigsaw', () => {
  it('creates every piece exactly once in the tray', () => {
    const s = createJigsaw(4, false, mulberry32(1))
    expect(s.tray.map((t) => t.id).sort((a, b) => a - b)).toEqual([...Array(16).keys()])
    expect(s.board.every((c) => c === null)).toBe(true)
  })

  it('locks only correct pieces and detects the win', () => {
    let s = createJigsaw(3, false, mulberry32(2))
    expect(placePiece(s, 0, 1)).toBe(s)
    for (let id = 0; id < 9; id++) s = placePiece(s, id, id)
    expect(s.tray).toHaveLength(0)
    expect(isJigsawSolved(s)).toBe(true)
  })

  it('requires rotation 0 before a piece can lock', () => {
    let s = createJigsaw(3, true, mulberry32(3))
    const turned = s.tray.find((t) => t.rot !== 0)!
    expect(canPlace(s, turned.id, turned.id)).toBe(false)
    for (let i = turned.rot; i < 4; i++) s = rotateTrayPiece(s, turned.id)
    expect(canPlace(s, turned.id, turned.id)).toBe(true)
  })

  it('hint places a piece even when it is rotated', () => {
    let s = createJigsaw(3, true, mulberry32(4))
    for (let i = 0; i < 9; i++) s = jigsawHint(s)!.state
    expect(isJigsawSolved(s)).toBe(true)
    expect(jigsawHint(s)).toBeNull()
  })
})
