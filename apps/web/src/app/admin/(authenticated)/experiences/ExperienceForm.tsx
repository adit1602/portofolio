'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, Button, Input, Label, Textarea, Checkbox } from '@portfolio/ui'
import { createExperience, updateExperience, Experience } from '@/lib/admin-api'

export default function ExperienceForm({ initialData }: { initialData?: Experience }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isCurrent, setIsCurrent] = useState(initialData?.isCurrent ?? false)

  // Format date for <input type="date"> (YYYY-MM-DD)
  const formatDate = (dateString?: string | null) => {
    if (!dateString) return ''
    return new Date(dateString).toISOString().split('T')[0]
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    const formData = new FormData(e.currentTarget)
    
    // Ensure date fields are sent as valid ISO strings or null
    const startDateRaw = formData.get('startDate') as string
    const endDateRaw = formData.get('endDate') as string
    
    const data = {
      company: formData.get('company') as string,
      role: formData.get('role') as string,
      description: formData.get('description') as string,
      startDate: new Date(startDateRaw).toISOString(),
      endDate: isCurrent ? null : (endDateRaw ? new Date(endDateRaw).toISOString() : null),
      isCurrent,
    }

    try {
      if (initialData) {
        await updateExperience(initialData.id, data)
      } else {
        await createExperience(data)
      }
      router.push('/admin/experiences')
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
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="company">Company</Label>
            <Input id="company" name="company" required defaultValue={initialData?.company} placeholder="e.g. Google" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Input id="role" name="role" required defaultValue={initialData?.role} placeholder="e.g. Senior Software Engineer" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea 
            id="description" 
            name="description" 
            required 
            defaultValue={initialData?.description} 
            placeholder="Describe your responsibilities and achievements..." 
          />
        </div>

        <div className="grid grid-cols-2 gap-4 items-start">
          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date</Label>
            <Input id="startDate" name="startDate" type="date" required defaultValue={formatDate(initialData?.startDate)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endDate">End Date</Label>
            <Input 
              id="endDate" 
              name="endDate" 
              type="date" 
              required={!isCurrent} 
              disabled={isCurrent}
              defaultValue={formatDate(initialData?.endDate)} 
            />
            <div className="flex items-center gap-2 mt-2">
              <Checkbox 
                id="isCurrent" 
                checked={isCurrent} 
                onChange={(e) => setIsCurrent(e.target.checked)} 
              />
              <Label htmlFor="isCurrent" className="font-normal cursor-pointer text-slate-400">
                I currently work here
              </Label>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 pt-4">
          <Button type="submit" loading={loading}>
            {initialData ? 'Save Changes' : 'Create Experience'}
          </Button>
          <Link href="/admin/experiences" className="px-6 py-3 text-sm font-semibold rounded-xl border border-white/10 text-slate-300 hover:text-white hover:border-white/20 transition-all duration-200">
            Cancel
          </Link>
        </div>
      </form>
    </Card>
  )
}
