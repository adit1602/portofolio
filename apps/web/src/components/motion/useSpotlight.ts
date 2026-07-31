'use client'

import { useCallback, useRef, type MouseEvent } from 'react'

/**
 * Tracks pointer position over an element as CSS custom properties
 * (--spot-x/--spot-y) so a `.spotlight-glow` child can render a
 * cursor-following radial highlight via pure CSS (see globals.css).
 */
export function useSpotlight<T extends HTMLElement>() {
  const ref = useRef<T>(null)

  const handleMouseMove = useCallback((e: MouseEvent<T>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    el.style.setProperty('--spot-x', `${e.clientX - rect.left}px`)
    el.style.setProperty('--spot-y', `${e.clientY - rect.top}px`)
  }, [])

  return { ref, handleMouseMove }
}
