'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, Button, Input, Label, Textarea, Checkbox } from '@portfolio/ui'
import { createProject, updateProject, getAdminSkills, uploadImage, Project, Skill } from '@/lib/admin-api'
import { resolveImageUrl } from '@/lib/media'

export default function ProjectForm({ initialData }: { initialData?: Project }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [featured, setFeatured] = useState(initialData?.featured ?? false)
  const [photoUrl, setPhotoUrl] = useState(initialData?.photoUrl ?? '')
  const [uploadingPhoto, setUploadingPhoto] = useState(false)

  // Skills selection
  const [allSkills, setAllSkills] = useState<Skill[]>([])
  const [selectedSkills, setSelectedSkills] = useState<Set<string>>(
    new Set(initialData?.skills?.map(s => s.skillId) ?? [])
  )

  useEffect(() => {
    getAdminSkills()
      .then(setAllSkills)
      .catch((err) => console.error('Failed to load skills:', err))
  }, [])

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingPhoto(true)
    setError('')
    try {
      const { url } = await uploadImage(file)
      setPhotoUrl(url)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setUploadingPhoto(false)
    }
  }

  function toggleSkill(skillId: string) {
    const next = new Set(selectedSkills)
    if (next.has(skillId)) {
      next.delete(skillId)
    } else {
      next.add(skillId)
    }
    setSelectedSkills(next)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    const formData = new FormData(e.currentTarget)
    
    const data = {
      title: formData.get('title') as string,
      slug: formData.get('slug') as string,
      description: formData.get('description') as string,
      liveUrl: (formData.get('liveUrl') as string) || null,
      repoUrl: (formData.get('repoUrl') as string) || null,
      order: parseInt(formData.get('order') as string, 10),
      photoUrl: photoUrl || null,
      featured,
      skillIds: Array.from(selectedSkills),
    }

    try {
      if (initialData) {
        await updateProject(initialData.id, data)
      } else {
        await createProject(data)
      }
      router.push('/admin/projects')
      router.refresh()
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <Card className="p-6 max-w-4xl">
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" required defaultValue={initialData?.title} placeholder="e.g. My Awesome Project" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">URL Slug</Label>
              <Input id="slug" name="slug" required defaultValue={initialData?.slug} placeholder="e.g. my-awesome-project" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="liveUrl">Live URL (optional)</Label>
              <Input id="liveUrl" name="liveUrl" type="url" defaultValue={initialData?.liveUrl ?? ''} placeholder="https://..." />
            </div>

            <div className="space-y-2">
              <Label htmlFor="repoUrl">Repository URL (optional)</Label>
              <Input id="repoUrl" name="repoUrl" type="url" defaultValue={initialData?.repoUrl ?? ''} placeholder="https://github.com/..." />
            </div>

            <div className="space-y-2">
              <Label htmlFor="photoInput">Project Photo (optional)</Label>
              <div className="flex items-center gap-4">
                {photoUrl && (
                  <img
                    src={resolveImageUrl(photoUrl) ?? undefined}
                    alt="Project preview"
                    className="w-16 h-16 rounded-lg object-cover border border-white/10"
                  />
                )}
                <Input
                  id="photoInput"
                  type="file"
                  accept="image/png, image/jpeg, image/webp, image/gif"
                  onChange={handlePhotoChange}
                  disabled={uploadingPhoto}
                />
              </div>
              {uploadingPhoto && <span className="text-xs text-slate-500">Uploading...</span>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="order">Display Order</Label>
                <Input id="order" name="order" type="number" required defaultValue={initialData?.order ?? 0} />
              </div>
              <div className="space-y-2">
                <Label>Featured</Label>
                <div className="flex items-center gap-2 h-11">
                  <Checkbox 
                    id="featured" 
                    checked={featured} 
                    onChange={(e) => setFeatured(e.target.checked)} 
                  />
                  <Label htmlFor="featured" className="font-normal cursor-pointer text-slate-400">
                    Feature on homepage
                  </Label>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6 flex flex-col">
            <div className="space-y-2 flex-1 flex flex-col">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                name="description" 
                required 
                defaultValue={initialData?.description} 
                placeholder="Describe the project..." 
                className="flex-1 min-h-[200px]"
              />
            </div>

            <div className="space-y-2">
              <Label>Technologies / Skills</Label>
              <div className="p-4 border border-white/10 rounded-xl bg-slate-900/50 max-h-48 overflow-y-auto space-y-2">
                {allSkills.length === 0 ? (
                  <p className="text-sm text-slate-500">Loading skills...</p>
                ) : (
                  allSkills.map(skill => (
                    <div key={skill.id} className="flex items-center gap-2">
                      <Checkbox 
                        id={`skill-${skill.id}`} 
                        checked={selectedSkills.has(skill.id)}
                        onChange={() => toggleSkill(skill.id)}
                      />
                      <Label htmlFor={`skill-${skill.id}`} className="font-normal cursor-pointer text-slate-300 text-sm">
                        {skill.name}
                      </Label>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 pt-4 border-t border-white/5">
          <Button type="submit" loading={loading}>
            {initialData ? 'Save Changes' : 'Create Project'}
          </Button>
          <Link href="/admin/projects" className="px-6 py-3 text-sm font-semibold rounded-xl border border-white/10 text-slate-300 hover:text-white hover:border-white/20 transition-all duration-200">
            Cancel
          </Link>
        </div>
      </form>
    </Card>
  )
}
