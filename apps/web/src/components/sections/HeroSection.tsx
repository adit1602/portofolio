import Link from 'next/link'
import { resolveImageUrl } from '@/lib/media'
import SocialIcon from '@/components/layout/SocialIcon'

interface HeroSectionProps {
  settings: Record<string, string>
  socialLinks: Array<{ id: string; platform: string; url: string; icon: string }>
}

/**
 * Hero section — first thing visitors see.
 * Full viewport height with animated gradient background.
 */
export default function HeroSection({ settings, socialLinks }: HeroSectionProps) {
  const name = settings['hero_name'] ?? 'John Doe'
  const title = settings['hero_title'] ?? 'Backend & DevOps Engineer'
  const bio = settings['hero_bio'] ?? 'Building reliable, scalable systems.'
  const email = settings['contact_email']
  const photoUrl = resolveImageUrl(settings['hero_photo_url'])
  const resumeUrl = resolveImageUrl(settings['resume_url'])

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background: grid + gradient orbs */}
      <div className="absolute inset-0 bg-hero-grid" aria-hidden="true" />
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl"
        style={{ background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)' }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-15 blur-3xl"
        style={{ background: 'radial-gradient(circle, #14b8a6 0%, transparent 70%)' }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="section-container relative z-10 text-center py-32">
        {/* Profile photo */}
        {photoUrl && (
          <div className="mb-8 flex justify-center animate-fade-in">
            <img
              src={photoUrl}
              alt={name}
              className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-2 border-slate-900/10 dark:border-white/10 shadow-[0_0_40px_rgba(99,102,241,0.25)]"
            />
          </div>
        )}

        {/* Status badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-teal-500/20 dark:border-teal-400/20 bg-teal-500/5 dark:bg-teal-400/5 text-teal-600 dark:text-teal-400 text-sm font-medium mb-8 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-teal-500 dark:bg-teal-400 animate-pulse-slow" />
          Available for opportunities
        </div>

        {/* Name */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 dark:text-white mb-4 animate-slide-up">
          Hi, I&apos;m{' '}
          <span className="gradient-text">{name}</span>
        </h1>

        {/* Title */}
        <p className="text-xl sm:text-2xl text-slate-600 dark:text-slate-400 font-medium mb-6 animate-slide-up animate-delay-100">
          {title}
        </p>

        {/* Bio */}
        <p className="max-w-2xl mx-auto text-slate-600 dark:text-slate-400 text-lg leading-relaxed mb-10 animate-slide-up animate-delay-200">
          {bio}
        </p>

        {/* CTA buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 animate-slide-up animate-delay-300">
          <a href="#projects" className="btn-primary">
            View My Work
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </a>
          {email && (
            <a href={`mailto:${email}`} className="btn-ghost">
              Get in Touch
            </a>
          )}
          {resumeUrl && (
            <a href={resumeUrl} download target="_blank" rel="noopener noreferrer" className="btn-ghost">
              Download CV
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3"
                />
              </svg>
            </a>
          )}
        </div>

        {/* Social links row */}
        {socialLinks.length > 0 && (
          <div className="flex items-center justify-center gap-6 mt-12 animate-fade-in animate-delay-500">
            {socialLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.platform}
                className="text-slate-600 dark:text-slate-500 hover:text-accent-600 dark:hover:text-accent-400 hover:-translate-y-0.5 transition-all duration-200"
              >
                <SocialIcon icon={link.icon} platform={link.platform} />
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce text-slate-500 dark:text-slate-600">
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  )
}
