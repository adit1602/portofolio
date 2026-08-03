'use client'

import { useId } from 'react'
import { resolveImageUrl } from '@/lib/media'

// Each preset renders on a fixed white chip (see the wrapper below), so
// icons use their real brand color instead of a theme-muted currentColor —
// otherwise a monochrome gray GitHub mark reads as "broken" next to a
// colorful uploaded logo like Instagram.
const PRESET_ICONS: Record<string, React.ReactNode> = {
  github: (
    <svg className="w-full h-full" fill="#181717" viewBox="0 0 24 24">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  ),
  linkedin: (
    <svg className="w-full h-full" fill="#0A66C2" viewBox="0 0 24 24">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
  twitter: (
    <svg className="w-full h-full" fill="#000000" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  website: (
    <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="#475569" strokeWidth={1.8}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0zM3.6 9h16.8M3.6 15h16.8M11.5 3a17 17 0 000 18M12.5 3a17 17 0 010 18"
      />
    </svg>
  ),
}

/** Simplified camera-badge glyph in Instagram's signature gradient. */
function InstagramIcon() {
  const gradientId = useId()
  return (
    <svg className="w-full h-full" viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="24" x2="24" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FEDA75" />
          <stop offset="0.35" stopColor="#F58529" />
          <stop offset="0.6" stopColor="#DD2A7B" />
          <stop offset="0.85" stopColor="#8134AF" />
          <stop offset="1" stopColor="#515BD4" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="6" fill={`url(#${gradientId})`} />
      <rect x="6.5" y="6.5" width="11" height="11" rx="3.5" stroke="white" strokeWidth="1.7" fill="none" />
      <circle cx="17.4" cy="6.6" r="1.1" fill="white" />
    </svg>
  )
}

function isImagePath(icon: string): boolean {
  return /^https?:\/\//i.test(icon) || icon.startsWith('/uploads/')
}

// Deterministic color per platform name, for the plain-text fallback badge.
const FALLBACK_PALETTES = [
  'from-indigo-500 to-blue-500',
  'from-teal-500 to-emerald-500',
  'from-rose-500 to-orange-500',
  'from-violet-500 to-fuchsia-500',
  'from-amber-500 to-orange-600',
  'from-sky-500 to-cyan-500',
]

function paletteFor(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0
  }
  return FALLBACK_PALETTES[hash % FALLBACK_PALETTES.length]!
}

/**
 * Resolves a social link's `icon` field to a visual, always inside a
 * consistent white chip: a known brand preset, an uploaded custom image
 * (which may have its own opaque background), or an initials badge.
 */
export default function SocialIcon({ icon, platform }: { icon: string; platform: string }) {
  const key = icon.toLowerCase().trim()
  const preset = key === 'instagram' ? <InstagramIcon /> : PRESET_ICONS[key]
  const imagePath = !preset && isImagePath(icon) ? resolveImageUrl(icon) : null

  if (preset || imagePath) {
    return (
      <span className="w-9 h-9 rounded-full bg-white shadow-sm ring-1 ring-slate-900/5 flex items-center justify-center p-2 shrink-0">
        {preset ?? <img src={imagePath!} alt={platform} className="w-full h-full object-contain" />}
      </span>
    )
  }

  return (
    <span
      className={`w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold text-white bg-gradient-to-br ${paletteFor(platform)} shrink-0`}
    >
      {platform.slice(0, 2).toUpperCase()}
    </span>
  )
}
