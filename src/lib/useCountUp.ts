import { useEffect, useState } from 'react'

/** Animates 0 → target with ease-out, starting after `delay` ms. */
export function useCountUp(target: number, duration = 900, delay = 0): number {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setValue(target)
      return
    }
    let raf = 0
    let start = 0
    const tick = (t: number) => {
      start ||= t
      const p = Math.min(1, (t - start) / duration)
      setValue(Math.round(target * (1 - (1 - p) ** 3)))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    const timer = setTimeout(() => (raf = requestAnimationFrame(tick)), delay)
    return () => {
      clearTimeout(timer)
      cancelAnimationFrame(raf)
    }
  }, [target, duration, delay])
  return value
}
