/**
 * API client for fetching data from the NestJS backend.
 * All functions are designed to be used in Next.js Server Components
 * (no 'use client' needed).
 */

const API_URL = process.env['API_URL'] ?? process.env['NEXT_PUBLIC_API_URL'] ?? 'http://localhost:3001'

/** Base fetch helper with error handling */
async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}/api${path}`, {
    // Revalidate every 60 seconds (ISR-style)
    next: { revalidate: 60 },
    ...options,
  })

  if (!res.ok) {
    throw new Error(`API error ${res.status} on ${path}`)
  }

  return res.json() as Promise<T>
}

// ---- Public API functions ----

export function getSiteSettings() {
  return apiFetch<Record<string, string>>('/settings')
}

export function getSocialLinks() {
  return apiFetch<Array<{ id: string; platform: string; url: string; icon: string; order: number }>>(
    '/settings/social-links',
  )
}

export function getSkillCategories() {
  return apiFetch<
    Array<{
      id: string
      name: string
      order: number
      skills: Array<{ id: string; name: string; level: number; iconUrl: string | null; order: number }>
    }>
  >('/skills/categories')
}

export function getExperiences() {
  return apiFetch<
    Array<{
      id: string
      company: string
      role: string
      description: string
      startDate: string
      endDate: string | null
      isCurrent: boolean
    }>
  >('/experiences')
}

export function getFeaturedProjects() {
  return apiFetch<
    Array<{
      id: string
      title: string
      slug: string
      description: string
      liveUrl: string | null
      repoUrl: string | null
      photoUrl: string | null
      featured: boolean
      order: number
      skills: Array<{ skill: { id: string; name: string } }>
    }>
  >('/projects?featured=true')
}

export function getAllProjects() {
  return apiFetch<
    Array<{
      id: string
      title: string
      slug: string
      description: string
      liveUrl: string | null
      repoUrl: string | null
      photoUrl: string | null
      featured: boolean
      order: number
      skills: Array<{ skill: { id: string; name: string } }>
    }>
  >('/projects')
}

export function getProjectBySlug(slug: string) {
  return apiFetch<{
    id: string
    title: string
    slug: string
    description: string
    liveUrl: string | null
    repoUrl: string | null
    photoUrl: string | null
    featured: boolean
    order: number
    skills: Array<{ skill: { id: string; name: string } }>
  }>(`/projects/by-slug/${slug}`)
}
