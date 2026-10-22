/** Haptic feedback; silently ignored where unsupported (iOS Safari, desktop). */
export function buzz(pattern: number | number[]) {
  try {
    navigator.vibrate?.(pattern)
  } catch {
    // vibrate can throw when blocked by permissions policy
  }
}
