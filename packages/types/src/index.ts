// ============================================================
// Shared TypeScript types for the portfolio monorepo
// Used by both apps/web and apps/api
// ============================================================

// ------ Auth ------

export type UserRole = 'admin' | 'editor'

export interface User {
  id: string
  email: string
  role: UserRole
  createdAt: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  user: User
}

// ------ Site Settings ------

export interface SiteSetting {
  id: string
  key: string
  value: string
}

// ------ Social Links ------

export interface SocialLink {
  id: string
  platform: string
  url: string
  icon: string
  order: number
}

// ------ Skills ------

export interface SkillCategory {
  id: string
  name: string
  order: number
  skills?: Skill[]
}

export interface Skill {
  id: string
  categoryId: string
  name: string
  /** Proficiency level 1–5 */
  level: number
  iconUrl?: string | null
  order: number
  category?: SkillCategory
}

export interface CreateSkillDto {
  categoryId: string
  name: string
  level: number
  iconUrl?: string
  order?: number
}

export interface UpdateSkillDto extends Partial<CreateSkillDto> {}

export interface CreateSkillCategoryDto {
  name: string
  order?: number
}

// ------ Experience ------

export interface Experience {
  id: string
  company: string
  role: string
  description: string
  startDate: string
  endDate?: string | null
  isCurrent: boolean
}

export interface CreateExperienceDto {
  company: string
  role: string
  description: string
  startDate: string
  endDate?: string
  isCurrent?: boolean
}

export interface UpdateExperienceDto extends Partial<CreateExperienceDto> {}

// ------ Projects ------

export interface Project {
  id: string
  title: string
  slug: string
  description: string
  liveUrl?: string | null
  repoUrl?: string | null
  featured: boolean
  order: number
  skills?: Skill[]
}

export interface CreateProjectDto {
  title: string
  slug: string
  description: string
  liveUrl?: string
  repoUrl?: string
  featured?: boolean
  order?: number
  skillIds?: string[]
}

export interface UpdateProjectDto extends Partial<CreateProjectDto> {}

// ------ API Response wrappers ------

export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
}
