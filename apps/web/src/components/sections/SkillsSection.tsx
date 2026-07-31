'use client'

import Reveal from '@/components/motion/Reveal'
import SpotlightGlow from '@/components/motion/SpotlightGlow'
import { useSpotlight } from '@/components/motion/useSpotlight'

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

const LEVEL_LABELS = ['', 'Beginner', 'Basic', 'Intermediate', 'Advanced', 'Expert']

function SkillCategoryCard({ category }: { category: SkillCategory }) {
  const { ref, handleMouseMove } = useSpotlight<HTMLDivElement>()

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      className="glass-card spotlight-card p-6 hover:glow-accent transition-all duration-300"
    >
      <SpotlightGlow />
      <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-5 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-accent-500 inline-block" />
        {category.name}
      </h3>

      <ul className="space-y-4">
        {category.skills.map((skill) => (
          <li key={skill.id}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{skill.name}</span>
              <span className="text-xs text-slate-500 dark:text-slate-500 font-mono">
                {LEVEL_LABELS[skill.level]}
              </span>
            </div>
            <div className="skill-bar">
              <div
                className="skill-bar-fill"
                style={{ width: `${(skill.level / 5) * 100}%` }}
                role="progressbar"
                aria-valuenow={skill.level}
                aria-valuemin={1}
                aria-valuemax={5}
                aria-label={`${skill.name} proficiency: ${skill.level}/5`}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

/**
 * Renders skill categories with animated level bars.
 * Level is 1–5; bar width = (level / 5) * 100%
 */
export default function SkillsSection({ categories }: SkillsSectionProps) {
  if (categories.length === 0) {
    return null
  }

  return (
    <section id="skills" className="py-24">
      <div className="section-container">
        {/* Header */}
        <Reveal className="mb-12">
          <p className="text-accent-600 dark:text-accent-400 text-sm font-semibold uppercase tracking-widest mb-2">
            What I work with
          </p>
          <h2 className="section-title">Skills & Technologies</h2>
          <div className="w-12 h-1 bg-gradient-to-r from-accent-500 to-teal-400 rounded-full mt-3" />
        </Reveal>

        {/* Category grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {categories.map((category, idx) => (
            <Reveal key={category.id} delay={Math.min(idx * 0.08, 0.32)}>
              <SkillCategoryCard category={category} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
