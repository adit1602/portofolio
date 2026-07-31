'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import ThemeToggle from '@/components/theme/ThemeToggle'

const NAV_LINKS = [
  { href: '#about', label: 'About', id: 'about' },
  { href: '#skills', label: 'Skills', id: 'skills' },
  { href: '#experience', label: 'Experience', id: 'experience' },
  { href: '#projects', label: 'Projects', id: 'projects' },
]

interface IndicatorState {
  left: number
  width: number
  ready: boolean
}

/**
 * Floating "Liquid Glass" navigation (iOS 26 style).
 * Pill-shaped, blurred, with a sliding capsule that tracks the active section.
 */
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeId, setActiveId] = useState<string>(NAV_LINKS[0]!.id)
  const [indicator, setIndicator] = useState<IndicatorState>({ left: 0, width: 0, ready: false })

  const listRef = useRef<HTMLUListElement>(null)
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({})

  // Solidify the glass a bit once the page is scrolled
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    handler()
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // Track which section is in view to drive the sliding indicator
  useEffect(() => {
    const sections = NAV_LINKS.map((l) => document.getElementById(l.id)).filter(
      (el): el is HTMLElement => !!el,
    )
    if (sections.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        if (visible.length > 0) {
          const mostVisible = visible.reduce((a, b) =>
            a.intersectionRatio > b.intersectionRatio ? a : b,
          )
          setActiveId(mostVisible.target.id)
        }
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] },
    )

    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  // Measure the active link and slide the capsule under it via transform
  const updateIndicator = useCallback(() => {
    const activeLink = linkRefs.current[activeId]
    const list = listRef.current
    if (!activeLink || !list) return

    const listRect = list.getBoundingClientRect()
    const linkRect = activeLink.getBoundingClientRect()
    setIndicator({ left: linkRect.left - listRect.left, width: linkRect.width, ready: true })
  }, [activeId])

  useEffect(() => {
    updateIndicator()
    window.addEventListener('resize', updateIndicator)
    return () => window.removeEventListener('resize', updateIndicator)
  }, [updateIndicator])

  return (
    <header className="fixed top-5 inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
      <div className="relative pointer-events-auto">
        <nav
          className={`liquid-glass flex items-center gap-1 rounded-full pl-4 pr-2 py-2 sm:pl-5 sm:pr-2.5 ${
            scrolled ? 'liquid-glass-scrolled' : ''
          }`}
        >
          {/* Logo / Name */}
          <Link
            href="/"
            id="nav-logo"
            className="text-base sm:text-lg font-bold gradient-text hover:opacity-80 transition-opacity duration-[250ms] shrink-0"
          >
            {'<DevPortfolio />'}
          </Link>

          {/* Desktop links */}
          <ul ref={listRef} className="relative hidden md:flex items-center gap-1 ml-4">
            {/* Sliding active-item capsule */}
            <li
              aria-hidden
              className={`liquid-glass-indicator absolute inset-y-0 rounded-full ${
                indicator.ready ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                width: `${indicator.width}px`,
                transform: `translateX(${indicator.left}px)`,
              }}
            />
            {NAV_LINKS.map((link) => (
              <li key={link.id} className="relative z-10">
                <a
                  ref={(el) => {
                    linkRefs.current[link.id] = el
                  }}
                  href={link.href}
                  onClick={() => setActiveId(link.id)}
                  className={`block px-4 py-1.5 rounded-full text-sm font-medium tracking-wide transition-all duration-[250ms] ease-out hover:scale-105 ${
                    activeId === link.id
                      ? 'text-slate-900 dark:text-white'
                      : 'text-slate-600/80 dark:text-slate-300/80 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Admin link */}
          <Link
            href="/admin/login"
            id="nav-admin"
            className="hidden md:inline-flex ml-2 text-sm px-4 py-1.5 rounded-full border border-slate-900/15 dark:border-white/15 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:border-slate-900/30 dark:hover:border-white/30 hover:scale-105 transition-all duration-[250ms] ease-out"
          >
            Admin
          </Link>

          {/* Theme toggle */}
          <ThemeToggle className="ml-1 shrink-0" />

          {/* Mobile hamburger */}
          <button
            id="nav-mobile-menu"
            className="md:hidden ml-1 p-2 rounded-full text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:scale-105 transition-all duration-[250ms] ease-out"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle mobile menu"
            aria-expanded={menuOpen}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </nav>

        {/* Mobile menu — floats below the pill, same glass language */}
        {menuOpen && (
          <div className="liquid-glass md:hidden absolute top-[calc(100%+12px)] left-1/2 -translate-x-1/2 w-64 rounded-[32px] p-3 animate-fade-in">
            <ul className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <li key={link.id}>
                  <a
                    href={link.href}
                    onClick={() => {
                      setActiveId(link.id)
                      setMenuOpen(false)
                    }}
                    className={`block px-4 py-2.5 rounded-full text-sm font-medium tracking-wide transition-all duration-[250ms] ease-out ${
                      activeId === link.id
                        ? 'bg-slate-900/[0.08] dark:bg-white/[0.14] text-slate-900 dark:text-white'
                        : 'text-slate-600/80 dark:text-slate-300/80 hover:text-slate-900 dark:hover:text-white hover:bg-slate-900/[0.05] dark:hover:bg-white/[0.08]'
                    }`}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <Link
                  href="/admin/login"
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-2.5 rounded-full text-sm font-medium tracking-wide text-accent-600 dark:text-accent-400 hover:text-accent-700 dark:hover:text-accent-300 hover:bg-slate-900/[0.05] dark:hover:bg-white/[0.08] transition-all duration-[250ms] ease-out"
                >
                  Admin Panel
                </Link>
              </li>
              <li className="flex items-center justify-between px-4 py-1 mt-1 border-t border-slate-900/10 dark:border-white/10 pt-3">
                <span className="text-sm font-medium tracking-wide text-slate-600 dark:text-slate-300/80">Theme</span>
                <ThemeToggle />
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  )
}
