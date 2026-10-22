import { useEffect, useState } from 'react'

/** Resolves true once the image is decoded, so tiles never flash empty. */
export function useImage(src: string): boolean {
  const [loaded, setLoaded] = useState(false)
  useEffect(() => {
    let alive = true
    setLoaded(false)
    const img = new Image()
    img.src = src
    img
      .decode()
      .catch(() => undefined)
      .then(() => alive && setLoaded(true))
    return () => {
      alive = false
    }
  }, [src])
  return loaded
}
