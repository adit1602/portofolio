'use client'

import Reveal from '@/components/motion/Reveal'
import SpotlightGlow from '@/components/motion/SpotlightGlow'
import { useSpotlight } from '@/components/motion/useSpotlight'

interface AboutSectionProps {
  settings: Record<string, string>
}

const HIGHLIGHTS = [
  { label: 'Years of Experience', value: '5+' },
  { label: 'Projects Shipped', value: '30+' },
  { label: 'Open Source Contributions', value: '15+' },
]

function StatCard({ label, value }: { label: string; value: string }) {
  const { ref, handleMouseMove } = useSpotlight<HTMLDivElement>()

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      className="glass-card spotlight-card p-6 group hover:glow-accent transition-all duration-300"
    >
      <SpotlightGlow />
      <div className="text-3xl font-extrabold gradient-text mb-1">{value}</div>
      <div className="text-sm text-slate-600 dark:text-slate-400">{label}</div>
    </div>
  )
}

export default function AboutSection({ settings }: AboutSectionProps) {
  const aboutText = settings['about_text'] ?? 'Passionate backend engineer...'

  return (
    <section id="about" className="py-24 bg-slate-50 dark:bg-dark-900/30">
      <div className="section-container">
        {/* Section header */}
        <Reveal className="mb-12">
          <p className="text-accent-600 dark:text-accent-400 text-sm font-semibold uppercase tracking-widest mb-2">
            Get to know me
          </p>
          <h2 className="section-title">About Me</h2>
          <div className="w-12 h-1 bg-gradient-to-r from-accent-500 to-teal-400 rounded-full mt-3" />
        </Reveal>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <Reveal delay={0.1}>
            <p className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed mb-6">{aboutText}</p>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              When I&apos;m not writing code, you&apos;ll find me contributing to open-source projects,
              reading about distributed systems, or tinkering with home lab infrastructure.
            </p>
          </Reveal>

          {/* Stats */}
          <Reveal delay={0.2} className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4">
            {HIGHLIGHTS.map((item) => (
              <StatCard key={item.label} label={item.label} value={item.value} />
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  )
}
