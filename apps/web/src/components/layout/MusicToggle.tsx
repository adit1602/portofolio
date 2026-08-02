'use client'

import { useEffect, useRef, useState } from 'react'

interface MusicToggleProps {
  musicUrl: string | null
}

const STORAGE_KEY = 'bg-music-on'

/** Floating on/off toggle for looping background music, driven by a site setting. */
export default function MusicToggle({ musicUrl }: MusicToggleProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [playing, setPlaying] = useState(false)

  // Resume playback across page loads only if the visitor had it on before —
  // browsers still require this to run after a user gesture, so it's best-effort.
  useEffect(() => {
    if (!musicUrl) return
    if (localStorage.getItem(STORAGE_KEY) === 'true') {
      audioRef.current?.play().then(
        () => setPlaying(true),
        () => setPlaying(false),
      )
    }
  }, [musicUrl])

  if (!musicUrl) {
    return null
  }

  function toggle() {
    const audio = audioRef.current
    if (!audio) return

    if (playing) {
      audio.pause()
      setPlaying(false)
      localStorage.setItem(STORAGE_KEY, 'false')
    } else {
      audio.play().catch(() => {})
      setPlaying(true)
      localStorage.setItem(STORAGE_KEY, 'true')
    }
  }

  return (
    <>
      <audio ref={audioRef} src={musicUrl} loop preload="none" />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? 'Pause background music' : 'Play background music'}
        aria-pressed={playing}
        className="liquid-glass fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full flex items-center justify-center text-slate-700 dark:text-slate-200 hover:scale-105 transition-transform duration-200"
      >
        {playing ? (
          <span className="flex items-end justify-center gap-0.5 h-4 w-4" aria-hidden="true">
            <span className="w-1 h-full bg-current rounded-full origin-bottom animate-eq" />
            <span className="w-1 h-full bg-current rounded-full origin-bottom animate-eq animate-delay-100" />
            <span className="w-1 h-full bg-current rounded-full origin-bottom animate-eq animate-delay-200" />
          </span>
        ) : (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 18V5l12-2v13M9 18a3 3 0 11-6 0 3 3 0 016 0zm12-2a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        )}
      </button>
    </>
  )
}
