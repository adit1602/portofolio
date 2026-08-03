'use client'

import { useState } from 'react'
import Reveal from '@/components/motion/Reveal'
import { resolveImageUrl } from '@/lib/media'

interface Skill {
  id: string
  name: string
  level: number
  iconUrl: string | null
  order: number
}

interface SkillCategory {
  id: string
  name: string
  order: number
  skills: Skill[]
}

interface SkillsSectionProps {
  categories: SkillCategory[]
}

// A handful of pleasant, distinct gradients — picked deterministically per
// skill name so the monogram fallback doesn't render as one repeated tile.
const MONOGRAM_PALETTES = [
  'from-indigo-500 to-blue-500',
  'from-teal-500 to-emerald-500',
  'from-rose-500 to-orange-500',
  'from-violet-500 to-fuchsia-500',
  'from-amber-500 to-orange-600',
  'from-sky-500 to-cyan-500',
  'from-emerald-500 to-lime-500',
  'from-pink-500 to-rose-500',
]

function paletteFor(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0
  }
  return MONOGRAM_PALETTES[hash % MONOGRAM_PALETTES.length]!
}

// Common name → skillicons.dev id mismatches. Anything not listed here falls
// back to the lowercased, punctuation-stripped skill name as a best guess.
const SKILLICONS_ALIASES: Record<string, string> = {
  javascript: 'js',
  typescript: 'ts',
  nodejs: 'nodejs',
  node: 'nodejs',
  reactjs: 'react',
  nextjs: 'next',
  vuejs: 'vue',
  angularjs: 'angular',
  python: 'py',
  golang: 'go',
  csharp: 'cs',
  dotnet: 'dotnet',
  k8s: 'kubernetes',
  postgresql: 'postgres',
  mongo: 'mongodb',
  bashshell: 'bash',
  shell: 'bash',
  githubactions: 'githubactions',
  html5: 'html',
  css3: 'css',
  scss: 'sass',
  tailwindcss: 'tailwind',
  expressjs: 'express',
  nest: 'nestjs',
  springboot: 'spring',
  vscode: 'vscode',
  visualstudiocode: 'vscode',
}

// Ids confirmed to return a real icon from skillicons.dev (verified against
// their API — unrecognized ids return a 200 OK with a blank SVG instead of
// an error, so guessing blindly would silently render an empty chip).
const SKILLICONS_KNOWN_IDS = new Set([
  'js', 'ts', 'react', 'next', 'vue', 'angular', 'svelte', 'nodejs', 'express', 'nestjs',
  'py', 'go', 'rust', 'java', 'php', 'laravel', 'html', 'css', 'sass', 'tailwind', 'bootstrap',
  'docker', 'kubernetes', 'mongodb', 'postgres', 'mysql', 'redis', 'sqlite', 'graphql',
  'git', 'github', 'githubactions', 'gitlab', 'bitbucket', 'linux', 'ubuntu', 'bash', 'nginx',
  'aws', 'gcp', 'azure', 'vercel', 'netlify', 'heroku', 'firebase', 'supabase',
  'figma', 'vscode', 'androidstudio', 'npm', 'yarn', 'pnpm', 'electron', 'threejs', 'unity',
  'django', 'flask', 'spring', 'rails', 'ruby', 'redux', 'prisma', 'webpack', 'vite',
  'jest', 'cypress', 'selenium', 'jenkins', 'terraform', 'ansible', 'grafana', 'prometheus',
  'kafka', 'rabbitmq', 'elasticsearch', 'kotlin', 'swift', 'dart', 'flutter',
  'cs', 'dotnet', 'cpp', 'c', 'wasm', 'deno', 'bun', 'nuxt', 'gatsby', 'solidjs', 'astro',
])

function autoIconSlug(name: string): string | null {
  const key = name.toLowerCase().replace(/\+/g, 'plus').replace(/[^a-z0-9]/g, '')
  const slug = SKILLICONS_ALIASES[key] ?? key
  return SKILLICONS_KNOWN_IDS.has(slug) ? slug : null
}

function TechCard({ skill }: { skill: Skill }) {
  const [imgFailed, setImgFailed] = useState(false)
  const uploadedUrl = resolveImageUrl(skill.iconUrl)
  // No custom icon uploaded? Try to auto-match a real logo from skillicons.dev
  // — but only for names on the verified whitelist, so an unrecognized skill
  // (e.g. an internal tool name) falls straight to the monogram instead of a
  // blank chip.
  const autoSlug = uploadedUrl ? null : autoIconSlug(skill.name)
  const imgSrc = uploadedUrl ?? (autoSlug ? `https://skillicons.dev/icons?i=${autoSlug}&theme=light` : null)

  return (
    <div className="shrink-0 w-28 sm:w-32 flex flex-col items-center justify-center gap-3 p-5 rounded-2xl bg-white/50 dark:bg-dark-800/60 backdrop-blur-sm border border-slate-900/10 dark:border-white/5 hover:border-accent-500/40 dark:hover:border-accent-400/30 hover:scale-105 hover:shadow-lg hover:shadow-accent-500/10 transition-all duration-300">
      <div className="w-12 h-12 flex items-center justify-center shrink-0">
        {imgSrc && !imgFailed ? (
          // White "chip" behind every icon — keeps logos with a baked-in
          // white background (many brand PNGs) from looking like a stray
          // white square once the card goes dark in dark mode.
          <span className="w-full h-full rounded-xl bg-white shadow-sm ring-1 ring-slate-900/5 flex items-center justify-center p-1.5">
            <img
              src={imgSrc}
              alt={skill.name}
              className="w-full h-full object-contain"
              onError={() => setImgFailed(true)}
            />
          </span>
        ) : (
          <span
            className={`w-full h-full rounded-xl flex items-center justify-center text-sm font-bold text-white bg-gradient-to-br ${paletteFor(skill.name)}`}
          >
            {skill.name.slice(0, 2).toUpperCase()}
          </span>
        )}
      </div>
      <span className="text-sm font-medium text-slate-700 dark:text-slate-300 text-center leading-tight truncate w-full">
        {skill.name}
      </span>
    </div>
  )
}

/**
 * Infinite horizontal ticker. The track is the row duplicated once and
 * animated to translateX(-50%) (or back, for the reverse row) — since the
 * two halves are identical, the loop point is invisible.
 */
function MarqueeRow({ skills, direction }: { skills: Skill[]; direction: 'left' | 'right' }) {
  if (skills.length === 0) return null

  const track = [...skills, ...skills]
  const animationClass = direction === 'left' ? 'animate-marquee-left' : 'animate-marquee-right'

  return (
    <div className="marquee-row overflow-hidden">
      <div
        className={`flex w-max gap-4 ${animationClass} hover:[animation-play-state:paused] motion-reduce:[animation-play-state:paused]`}
      >
        {track.map((skill, idx) => (
          <TechCard key={`${skill.id}-${idx}`} skill={skill} />
        ))}
      </div>
    </div>
  )
}

/**
 * Skills shown as a two-row ticker scrolling in opposite directions —
 * a quick-scan tech showcase rather than a detailed proficiency breakdown.
 */
export default function SkillsSection({ categories }: SkillsSectionProps) {
  const skills = [...categories]
    .sort((a, b) => a.order - b.order)
    .flatMap((category) => [...category.skills].sort((a, b) => a.order - b.order))

  if (skills.length === 0) {
    return null
  }

  const rowLeft: Skill[] = []
  const rowRight: Skill[] = []
  skills.forEach((skill, idx) => (idx % 2 === 0 ? rowLeft : rowRight).push(skill))

  return (
    <section id="skills" className="py-24 overflow-hidden">
      <div className="section-container">
        {/* Header */}
        <Reveal className="mb-12">
          <p className="text-accent-600 dark:text-accent-400 text-sm font-semibold uppercase tracking-widest mb-2">
            What I work with
          </p>
          <h2 className="section-title">Skills & Technologies</h2>
          <div className="w-12 h-1 bg-gradient-to-r from-accent-500 to-teal-400 rounded-full mt-3" />
        </Reveal>
      </div>

      {/* Ticker rows — bleed full-width, outside section-container on purpose */}
      <Reveal delay={0.15} className="space-y-4">
        <MarqueeRow skills={rowLeft} direction="left" />
        <MarqueeRow skills={rowRight} direction="right" />
      </Reveal>
    </section>
  )
}
