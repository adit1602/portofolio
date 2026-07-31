'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import SkillForm from '../SkillForm'
import { getAdminSkill, Skill } from '@/lib/admin-api'

export default function EditSkillPage() {
  const params = useParams()
  const id = params.id as string
  
  const [skill, setSkill] = useState<Skill | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getAdminSkill(id)
      .then(setSkill)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return <div className="text-slate-400">Loading skill...</div>
  }

  if (error || !skill) {
    return (
      <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
        Error loading skill: {error || 'Not found'}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Edit Skill</h1>
        <p className="text-slate-500 text-sm">Update the properties of this skill.</p>
      </div>
      <SkillForm initialData={skill} />
    </div>
  )
}
