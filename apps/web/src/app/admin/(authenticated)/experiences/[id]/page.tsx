'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import ExperienceForm from '../ExperienceForm'
import { getAdminExperience, Experience } from '@/lib/admin-api'

export default function EditExperiencePage() {
  const params = useParams()
  const id = params.id as string
  
  const [experience, setExperience] = useState<Experience | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getAdminExperience(id)
      .then(setExperience)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return <div className="text-slate-400">Loading experience...</div>
  }

  if (error || !experience) {
    return (
      <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
        Error loading experience: {error || 'Not found'}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Edit Experience</h1>
        <p className="text-slate-500 text-sm">Update the details of this experience.</p>
      </div>
      <ExperienceForm initialData={experience} />
    </div>
  )
}
