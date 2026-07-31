import { getSiteSettings, getSocialLinks, getSkillCategories, getExperiences, getFeaturedProjects } from '@/lib/api'
import HeroSection from '@/components/sections/HeroSection'
import AboutSection from '@/components/sections/AboutSection'
import SkillsSection from '@/components/sections/SkillsSection'
import ExperienceSection from '@/components/sections/ExperienceSection'
import ProjectsSection from '@/components/sections/ProjectsSection'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

/**
 * Home page — fetches all data in parallel server-side.
 * Each section receives its data as props.
 */
export default async function HomePage() {
  // Fetch all data in parallel for efficiency
  const [settings, socialLinks, skillCategories, experiences, featuredProjects] =
    await Promise.all([
      getSiteSettings().catch(() => ({} as Record<string, string>)),
      getSocialLinks().catch(() => []),
      getSkillCategories().catch(() => []),
      getExperiences().catch(() => []),
      getFeaturedProjects().catch(() => []),
    ])

  return (
    <>
      <Navbar />
      <main>
        <HeroSection settings={settings} socialLinks={socialLinks} />
        <AboutSection settings={settings} />
        <SkillsSection categories={skillCategories} />
        <ExperienceSection experiences={experiences} />
        <ProjectsSection projects={featuredProjects} />
      </main>
      <Footer settings={settings} socialLinks={socialLinks} />
    </>
  )
}
