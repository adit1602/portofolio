'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, Button, Input, Label, Textarea } from '@portfolio/ui'
import { createSkill, updateSkill, getAdminSkillCategories, Skill } from '@/lib/admin-api'

export default function SkillForm({ initialData }: { initialData?: Skill }) {
  const router = useRouter()
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    getAdminSkillCategories()
      .then(setCategories)
      .catch((err) => setError('Failed to load categories: ' + err.message))
  }, [])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get('name') as string,
      categoryId: formData.get('categoryId') as string,
      level: parseInt(formData.get('level') as string, 10),
      order: parseInt(formData.get('order') as string, 10),
      iconUrl: (formData.get('iconUrl') as string) || null,
    }

    try {
      if (initialData) {
        await updateSkill(initialData.id, data)
      } else {
        await createSkill(data)
      }
      router.push('/admin/skills')
      router.refresh()
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <Card className="p-6 max-w-2xl">
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Skill Name</Label>
          <Input id="name" name="name" required defaultValue={initialData?.name} placeholder="e.g. React" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="categoryId">Category</Label>
          <select 
            id="categoryId" 
            name="categoryId" 
            required 
            defaultValue={initialData?.categoryId}
            className="flex h-11 w-full rounded-xl border border-white/10 bg-slate-900/50 px-4 py-2 text-sm text-white transition-colors placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:border-transparent"
          >
            <option value="" disabled>Select a category</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="level">Proficiency Level (1-5)</Label>
            <Input id="level" name="level" type="number" min="1" max="5" required defaultValue={initialData?.level ?? 3} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="order">Display Order</Label>
            <Input id="order" name="order" type="number" required defaultValue={initialData?.order ?? 0} />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="iconUrl">Icon URL (optional)</Label>
          <Input id="iconUrl" name="iconUrl" type="url" defaultValue={initialData?.iconUrl ?? ''} placeholder="https://..." />
        </div>

        <div className="flex items-center gap-4 pt-4">
          <Button type="submit" loading={loading}>
            {initialData ? 'Save Changes' : 'Create Skill'}
          </Button>
          <Link href="/admin/skills" className="px-6 py-3 text-sm font-semibold rounded-xl border border-white/10 text-slate-300 hover:text-white hover:border-white/20 transition-all duration-200">
            Cancel
          </Link>
        </div>
      </form>
    </Card>
  )
}
