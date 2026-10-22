/** Tiny WebAudio synth: no audio files to download or cache. */

let ctx: AudioContext | null = null

function audio(): AudioContext | null {
  try {
    ctx ??= new AudioContext()
    if (ctx.state === 'suspended') void ctx.resume()
    return ctx
  } catch {
    return null
  }
}

function tone(freq: number, start: number, dur: number, type: OscillatorType = 'sine', gain = 0.18) {
  const a = audio()
  if (!a) return
  const t = a.currentTime + start
  const osc = a.createOscillator()
  const g = a.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, t)
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(gain, t + 0.01)
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  osc.connect(g).connect(a.destination)
  osc.start(t)
  osc.stop(t + dur + 0.02)
}

export type Sound = 'tap' | 'snap' | 'wrong' | 'win' | 'fail'

export function play(sound: Sound) {
  switch (sound) {
    case 'tap':
      return tone(660, 0, 0.06, 'triangle', 0.08)
    case 'snap':
      tone(880, 0, 0.08, 'triangle')
      return tone(1320, 0.05, 0.12, 'sine', 0.12)
    case 'wrong':
      return tone(150, 0, 0.18, 'square', 0.06)
    case 'win':
      return [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.11, 0.3, 'triangle', 0.16))
    case 'fail':
      return [392, 330, 262].forEach((f, i) => tone(f, i * 0.16, 0.3, 'sine', 0.14))
  }
}
