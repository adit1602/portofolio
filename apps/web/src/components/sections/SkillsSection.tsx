'use client'

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

function TechCard({ skill }: { skill: Skill }) {
  const iconUrl = resolveImageUrl(skill.iconUrl)

  return (
    <div className="shrink-0 w-28 sm:w-32 flex flex-col items-center justify-center gap-3 p-5 rounded-2xl bg-white/50 dark:bg-dark-800/60 backdrop-blur-sm border border-slate-900/10 dark:border-white/5 hover:border-accent-500/40 dark:hover:border-accent-400/30 hover:scale-105 hover:shadow-lg hover:shadow-accent-500/10 transition-all duration-300">
      <div className="w-12 h-12 flex items-center justify-center shrink-0">
        {iconUrl ? (
          <img
            src={iconUrl}
            alt={skill.name}
            className="w-full h-full object-contain grayscale-[15%] group-hover:grayscale-0 transition-all duration-300"
          />
        ) : (
          <span className="w-full h-full rounded-xl flex items-center justify-center text-sm font-bold text-white bg-gradient-to-br from-accent-500 to-teal-500">
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
