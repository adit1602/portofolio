/**
 * API client for the Admin dashboard.
 * These functions are meant to be called from Client Components.
 * They automatically attach the JWT access token from localStorage.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'

// Dedupes concurrent refresh attempts (e.g. several requests 401 at once)
// so they all await the same in-flight call instead of racing.
let refreshPromise: Promise<string | null> | null = null

/**
 * Exchanges the httpOnly refresh cookie for a new access token, storing it
 * in localStorage. The API also rotates the refresh cookie on every call,
 * so as long as this keeps getting called (see AuthenticatedAdminLayout's
 * periodic timer + the 401 retry below), the session never hits a hard
 * expiry — only an explicit logout, or the refresh cookie going fully idle
 * for 30 days, ends it.
 */
export async function refreshAccessToken(): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        const res = await fetch(`${API_URL}/api/auth/refresh`, {
          method: 'POST',
          credentials: 'include',
        })
        if (!res.ok) return null
        const data = (await res.json()) as { accessToken: string }
        localStorage.setItem('access_token', data.accessToken)
        return data.accessToken
      } catch {
        return null
      } finally {
        refreshPromise = null
      }
    })()
  }
  return refreshPromise
}

async function authFetch<T>(path: string, options?: RequestInit, isRetry = false): Promise<T> {
  const token = localStorage.getItem('access_token')
  if (!token) {
    throw new Error('Not authenticated')
  }

  const headers = new Headers(options?.headers)
  headers.set('Authorization', `Bearer ${token}`)

  if (!(options?.body instanceof FormData) && !headers.has('Content-Type') && options?.body) {
    headers.set('Content-Type', 'application/json')
  }

  const res = await fetch(`${API_URL}/api${path}`, {
    ...options,
    headers,
  })

  // Access token expired mid-session (15min lifetime) — silently refresh
  // and retry once instead of surfacing an error to the user.
  if (res.status === 401 && !isRetry) {
    const newToken = await refreshAccessToken()
    if (newToken) {
      return authFetch<T>(path, options, true)
    }
    localStorage.removeItem('access_token')
  }

  if (!res.ok) {
    // Basic error handling - could be improved based on API response structure
    let message = `API Error ${res.status}`
    try {
      const errorData = await res.json()
      if (errorData.message) {
        message = Array.isArray(errorData.message) ? errorData.message[0] : errorData.message
      }
    } catch (e) {
      // Ignore JSON parse error if response is not JSON
    }
    throw new Error(message)
  }

  // Handle empty responses (like 204 No Content or simple DELETE)
  const text = await res.text()
  if (!text) return {} as T
  
  try {
    return JSON.parse(text) as T
  } catch (e) {
    return text as unknown as T
  }
}

// ==========================================
// Skills
// ==========================================

export interface Skill {
  id: string
  name: string
  level: number
  iconUrl: string | null
  order: number
  categoryId: string
  category?: { id: string; name: string }
}

export function getAdminSkills() {
  return authFetch<Skill[]>('/skills')
}

export function getAdminSkill(id: string) {
  return authFetch<Skill>(`/skills/${id}`)
}

export function createSkill(data: Partial<Skill>) {
  return authFetch<Skill>('/skills', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function updateSkill(id: string, data: Partial<Skill>) {
  return authFetch<Skill>(`/skills/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
}

export function deleteSkill(id: string) {
  return authFetch<{ success: boolean }>(`/skills/${id}`, {
    method: 'DELETE',
  })
}

// Categories for select dropdowns
export function getAdminSkillCategories() {
  return authFetch<Array<{ id: string; name: string }>>('/skills/categories')
}

// ==========================================
// Experiences
// ==========================================

export interface Experience {
  id: string
  company: string
  role: string
  description: string
  startDate: string
  endDate: string | null
  isCurrent: boolean
}

export function getAdminExperiences() {
  return authFetch<Experience[]>('/experiences')
}

export function getAdminExperience(id: string) {
  return authFetch<Experience>(`/experiences/${id}`)
}

export function createExperience(data: Partial<Experience>) {
  return authFetch<Experience>('/experiences', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function updateExperience(id: string, data: Partial<Experience>) {
  return authFetch<Experience>(`/experiences/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
}

export function deleteExperience(id: string) {
  return authFetch<{ success: boolean }>(`/experiences/${id}`, {
    method: 'DELETE',
  })
}

// ==========================================
// Projects
// ==========================================

export interface Project {
  id: string
  title: string
  slug: string
  description: string
  liveUrl: string | null
  repoUrl: string | null
  photoUrl: string | null
  featured: boolean
  order: number
  skills?: Array<{ skillId: string; skill?: { name: string } }>
}

export function getAdminProjects() {
  return authFetch<Project[]>('/projects')
}

export function getAdminProject(id: string) {
  return authFetch<Project>(`/projects/${id}`)
}

export function createProject(data: any) {
  return authFetch<Project>('/projects', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function updateProject(id: string, data: any) {
  return authFetch<Project>(`/projects/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
}

export function deleteProject(id: string) {
  return authFetch<{ success: boolean }>(`/projects/${id}`, {
    method: 'DELETE',
  })
}

// ==========================================
// Uploads
// ==========================================

/** Uploads an image file (profile photo, project photo) and returns its public URL */
export function uploadImage(file: File) {
  const formData = new FormData()
  formData.append('file', file)
  return authFetch<{ url: string }>('/uploads', {
    method: 'POST',
    body: formData,
  })
}

// ==========================================
// Settings
// ==========================================

export function updateSiteSettings(settings: Record<string, string>) {
  return authFetch<{ success: boolean }>('/settings', {
    method: 'PATCH',
    body: JSON.stringify(settings),
  })
}

// Social Links
export interface SocialLink {
  id: string
  platform: string
  url: string
  icon: string
  order: number
}

export function createSocialLink(data: Omit<SocialLink, 'id'>) {
  return authFetch<SocialLink>('/settings/social-links', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function deleteSocialLink(id: string) {
  return authFetch<{ success: boolean }>(`/settings/social-links/${id}`, {
    method: 'DELETE',
  })
}
