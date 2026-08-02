import Link from 'next/link'
import SocialIcon from './SocialIcon'

interface FooterProps {
  settings: Record<string, string>
  socialLinks: Array<{ id: string; platform: string; url: string; icon: string; order: number }>
}

export default function Footer({ settings, socialLinks }: FooterProps) {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-slate-900/10 dark:border-white/5 bg-slate-200/50 dark:bg-dark-900/50 mt-20 transition-colors duration-300">
      <div className="section-container py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div>
            <Link href="/" className="text-lg font-bold gradient-text">
              {'<DitzPortfolio />'}
            </Link>
            <p className="text-sm text-slate-600 dark:text-slate-500 mt-1">
              {settings['hero_title'] ?? 'Backend & DevOps Engineer'}
            </p>
          </div>

          {/* Social links */}
          {socialLinks.length > 0 && (
            <div className="flex items-center gap-4">
              {socialLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.platform}
                  className="text-slate-500 dark:text-slate-500 hover:text-accent-600 dark:hover:text-accent-400 transition-colors duration-200"
                >
                  <SocialIcon icon={link.icon} platform={link.platform} />
                </a>
              ))}
            </div>
          )}

          {/* Copyright */}
          <p className="text-sm text-slate-500 dark:text-slate-600">
            © {currentYear} {settings['hero_name'] ?? 'Portfolio'}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
