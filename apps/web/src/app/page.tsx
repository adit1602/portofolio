import {
  getSiteSettings,
  getSocialLinks,
  getSkillCategories,
  getExperiences,
  getFeaturedProjects,
  getAllProjects,
} from '@/lib/api'
import { resolveImageUrl } from '@/lib/media'
import HeroSection from '@/components/sections/HeroSection'
import AboutSection from '@/components/sections/AboutSection'
import SkillsSection from '@/components/sections/SkillsSection'
import ExperienceSection from '@/components/sections/ExperienceSection'
import ProjectsSection from '@/components/sections/ProjectsSection'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import MusicToggle from '@/components/layout/MusicToggle'

/** Whole years elapsed since the earliest experience start date. */
function computeYearsExperience(experiences: Array<{ startDate: string }>): number {
  if (experiences.length === 0) return 0
  const earliest = experiences.reduce(
    (min, exp) => Math.min(min, new Date(exp.startDate).getTime()),
    Infinity,
  )
  const msPerYear = 365.25 * 24 * 60 * 60 * 1000
  return Math.floor((Date.now() - earliest) / msPerYear)
}

/**
 * Home page — fetches all data in parallel server-side.
 * Each section receives its data as props.
 */
export default async function HomePage() {
  // Fetch all data in parallel for efficiency
  const [settings, socialLinks, skillCategories, experiences, featuredProjects, allProjects] =
    await Promise.all([
      getSiteSettings().catch(() => ({} as Record<string, string>)),
      getSocialLinks().catch(() => []),
      getSkillCategories().catch(() => []),
      getExperiences().catch(() => []),
      getFeaturedProjects().catch(() => []),
      getAllProjects().catch(() => []),
    ])

  const aboutStats = {
    yearsExperience: computeYearsExperience(experiences),
    projectsShipped: allProjects.length,
    technologies: skillCategories.reduce((sum, category) => sum + category.skills.length, 0),
  }

  return (
    <>
      <Navbar />
      <main>
        <HeroSection settings={settings} socialLinks={socialLinks} />
        <AboutSection settings={settings} stats={aboutStats} />
        <SkillsSection categories={skillCategories} />
        <ExperienceSection experiences={experiences} />
        <ProjectsSection projects={featuredProjects} />
      </main>
      <Footer settings={settings} socialLinks={socialLinks} />
      <MusicToggle musicUrl={resolveImageUrl(settings['bg_music_url'])} />
    </>
  )
}
