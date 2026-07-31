'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import ProjectForm from '../ProjectForm'
import { getAdminProject, Project } from '@/lib/admin-api'

export default function EditProjectPage() {
  const params = useParams()
  const id = params.id as string
  
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getAdminProject(id)
      .then(setProject)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return <div className="text-slate-400">Loading project...</div>
  }

  if (error || !project) {
    return (
      <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
        Error loading project: {error || 'Not found'}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Edit Project</h1>
        <p className="text-slate-500 text-sm">Update the details of this project.</p>
      </div>
      <ProjectForm initialData={project} />
    </div>
  )
}
