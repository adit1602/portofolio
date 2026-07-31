/**
 * Resolves an uploaded image's relative path (e.g. "/uploads/abc.jpg")
 * returned by the API into an absolute URL the browser can load directly.
 */
export function resolveImageUrl(path: string | null | undefined): string | null {
  if (!path) return null
  if (/^https?:\/\//i.test(path)) return path
  const base = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'
  return `${base}${path}`
}
