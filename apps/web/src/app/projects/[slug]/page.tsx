import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getProjectBySlug, getSiteSettings, getSocialLinks } from '@/lib/api'
import { resolveImageUrl } from '@/lib/media'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Reveal from '@/components/motion/Reveal'

interface ProjectPageProps {
  params: { slug: string }
}

async function loadProject(slug: string) {
  try {
    return await getProjectBySlug(slug)
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const project = await loadProject(params.slug)
  if (!project) return {}
  return {
    title: project.title,
    description: project.description,
  }
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const [project, settings, socialLinks] = await Promise.all([
    loadProject(params.slug),
    getSiteSettings().catch(() => ({} as Record<string, string>)),
    getSocialLinks().catch(() => []),
  ])

  if (!project) {
    notFound()
  }

  const photoUrl = resolveImageUrl(project.photoUrl)

  return (
    <>
      <Navbar />
      <main>
        <section className="pt-40 pb-24">
          <div className="section-container max-w-4xl">
            <Reveal>
              <Link
                href="/#projects"
                className="inline-flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors mb-8"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Projects
              </Link>
            </Reveal>

            <Reveal delay={0.05} className="glass-card overflow-hidden">
              {photoUrl && (
                <img src={photoUrl} alt={project.title} className="w-full h-64 sm:h-80 object-cover" />
              )}

              <div className="p-6 sm:p-10">
                {project.featured && (
                  <span className="badge mb-4">
                    <svg className="w-3 h-3 text-accent-600 dark:text-accent-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    Featured
                  </span>
                )}

                <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                  {project.title}
                </h1>

                {project.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {project.skills.map(({ skill }) => (
                      <span key={skill.id} className="badge text-xs">
                        {skill.name}
                      </span>
                    ))}
                  </div>
                )}

                <p className="text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line mb-8">
                  {project.description}
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-slate-900/10 dark:border-white/5">
                  {project.liveUrl && (
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Live Demo
                    </a>
                  )}
                  {project.repoUrl && (
                    <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                      </svg>
                      Source Code
                    </a>
                  )}
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer settings={settings} socialLinks={socialLinks} />
    </>
  )
}
