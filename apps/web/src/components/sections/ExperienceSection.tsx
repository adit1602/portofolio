'use client'

import Reveal from '@/components/motion/Reveal'
import SpotlightGlow from '@/components/motion/SpotlightGlow'
import { useSpotlight } from '@/components/motion/useSpotlight'

interface Experience {
  id: string
  company: string
  role: string
  description: string
  startDate: string
  endDate: string | null
  isCurrent: boolean
}

interface ExperienceSectionProps {
  experiences: Experience[]
}

/** Format a date string like "2022-01-01T..." → "Jan 2022" */
function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

function ExperienceCard({ exp }: { exp: Experience }) {
  const { ref, handleMouseMove } = useSpotlight<HTMLElement>()

  return (
    <article
      ref={ref}
      onMouseMove={handleMouseMove}
      className="glass-card spotlight-card p-6 hover:glow-accent transition-all duration-300 group"
    >
      <SpotlightGlow />
      {/* Date range */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className="text-xs font-mono text-accent-600 dark:text-accent-400">
          {formatDate(exp.startDate)} —{' '}
          {exp.isCurrent ? (
            <span className="text-teal-600 dark:text-teal-400 font-semibold">Present</span>
          ) : exp.endDate ? (
            formatDate(exp.endDate)
          ) : (
            'N/A'
          )}
        </span>
        {exp.isCurrent && (
          <span className="badge bg-teal-500/10 dark:bg-teal-400/10 text-teal-700 dark:text-teal-400 border-teal-500/20 dark:border-teal-400/20">
            Current
          </span>
        )}
      </div>

      {/* Role & company */}
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-0.5">{exp.role}</h3>
      <p className="text-accent-600 dark:text-accent-400 font-medium text-sm mb-3">{exp.company}</p>

      {/* Description */}
      <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{exp.description}</p>
    </article>
  )
}

export default function ExperienceSection({ experiences }: ExperienceSectionProps) {
  if (experiences.length === 0) {
    return null
  }

  return (
    <section id="experience" className="py-24 bg-slate-50 dark:bg-dark-900/30">
      <div className="section-container">
        {/* Header */}
        <Reveal className="mb-12">
          <p className="text-accent-600 dark:text-accent-400 text-sm font-semibold uppercase tracking-widest mb-2">
            Career journey
          </p>
          <h2 className="section-title">Work Experience</h2>
          <div className="w-12 h-1 bg-gradient-to-r from-accent-500 to-teal-400 rounded-full mt-3" />
        </Reveal>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div
            className="absolute left-[6px] top-2 bottom-2 w-px bg-gradient-to-b from-accent-500 via-slate-300 dark:via-dark-700 to-transparent hidden sm:block"
            aria-hidden="true"
          />

          <ul className="space-y-10">
            {experiences.map((exp, idx) => (
              <Reveal key={exp.id} as="li" delay={Math.min(idx * 0.08, 0.32)} className="sm:pl-10 relative">
                {/* Timeline dot (hidden on mobile) */}
                <div className="timeline-dot absolute -left-0 top-1.5 hidden sm:block" aria-hidden="true" />
                <ExperienceCard exp={exp} />
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
