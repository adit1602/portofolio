'use client'

import { useState } from 'react'
import Link from 'next/link'
import { resolveImageUrl } from '@/lib/media'
import Reveal from '@/components/motion/Reveal'
import SpotlightGlow from '@/components/motion/SpotlightGlow'
import { useSpotlight } from '@/components/motion/useSpotlight'

/** Number of project cards shown before the "show more" toggle appears. */
const INITIAL_VISIBLE_COUNT = 6

interface ProjectSkillLink {
  skill: { id: string; name: string }
}

interface Project {
  id: string
  title: string
  slug: string
  description: string
  liveUrl: string | null
  repoUrl: string | null
  photoUrl: string | null
  featured: boolean
  order: number
  skills: ProjectSkillLink[]
}

interface ProjectsSectionProps {
  projects: Project[]
}

function ProjectCard({ project }: { project: Project }) {
  const { ref, handleMouseMove } = useSpotlight<HTMLElement>()

  return (
    <article
      ref={ref}
      onMouseMove={handleMouseMove}
      className="glass-card spotlight-card overflow-hidden flex flex-col group hover:glow-accent hover:-translate-y-1 transition-all duration-300"
    >
      <SpotlightGlow />
      {/* Photo (optional) */}
      {project.photoUrl && (
        <img
          src={resolveImageUrl(project.photoUrl)!}
          alt={project.title}
          className="w-full h-40 object-cover"
        />
      )}

      <div className="p-6 flex flex-col flex-1">
        {/* Featured star */}
        {project.featured && (
          <div className="flex justify-end mb-3">
            <span className="badge">
              <svg className="w-3 h-3 text-accent-600 dark:text-accent-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Featured
            </span>
          </div>
        )}

        {/* Title */}
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-accent-600 dark:group-hover:text-accent-300 transition-colors">
          {project.title}
        </h3>

        {/* Description */}
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed line-clamp-3 mb-4">
          {project.description}
        </p>

        {/* Skills tags */}
        {project.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-5">
            {project.skills.map(({ skill }) => (
              <span key={skill.id} className="badge text-xs">
                {skill.name}
              </span>
            ))}
          </div>
        )}

        {/* Links */}
        <div className="flex items-center gap-3 mt-auto pt-4 border-t border-slate-900/10 dark:border-white/5">
          <Link
            href={`/projects/${project.slug}`}
            aria-label={`${project.title} details`}
            className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Details
          </Link>
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.title} source code`}
              className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
              </svg>
              Code
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.title} live demo`}
              className="flex items-center gap-1.5 text-xs text-accent-600 dark:text-accent-400 hover:text-accent-700 dark:hover:text-accent-300 transition-colors ml-auto"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Live Demo
            </a>
          )}
        </div>
      </div>
    </article>
  )
}

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
  const [expanded, setExpanded] = useState(false)

  if (projects.length === 0) {
    return null
  }

  const hasMore = projects.length > INITIAL_VISIBLE_COUNT
  const visibleProjects = expanded ? projects : projects.slice(0, INITIAL_VISIBLE_COUNT)

  return (
    <section id="projects" className="py-24">
      <div className="section-container">
        {/* Header */}
        <Reveal className="mb-12">
          <p className="text-accent-600 dark:text-accent-400 text-sm font-semibold uppercase tracking-widest mb-2">
            Things I&apos;ve built
          </p>
          <h2 className="section-title">Featured Projects</h2>
          <div className="w-12 h-1 bg-gradient-to-r from-accent-500 to-teal-400 rounded-full mt-3" />
        </Reveal>

        {/* Project cards grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
          {visibleProjects.map((project, idx) => (
            <Reveal key={project.id} delay={Math.min(idx * 0.08, 0.32)}>
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>

        {/* Show more / less toggle */}
        {hasMore && (
          <div className="flex justify-center mt-10">
            <button type="button" onClick={() => setExpanded((v) => !v)} className="btn-ghost">
              {expanded ? 'Lihat Lebih Sedikit' : `Lihat Selengkapnya (${projects.length - INITIAL_VISIBLE_COUNT} lainnya)`}
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
