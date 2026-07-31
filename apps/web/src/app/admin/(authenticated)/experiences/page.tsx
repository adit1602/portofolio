'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, Badge } from '@portfolio/ui'
import { getAdminExperiences, deleteExperience, Experience } from '@/lib/admin-api'

export default function ExperiencesPage() {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function loadExperiences() {
    setLoading(true)
    try {
      const data = await getAdminExperiences()
      setExperiences(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadExperiences()
  }, [])

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this experience?')) return
    
    try {
      await deleteExperience(id)
      await loadExperiences()
    } catch (err: any) {
      alert(err.message)
    }
  }

  if (loading) {
    return <div className="text-slate-400">Loading experiences...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Experiences</h1>
          <p className="text-slate-500 text-sm">Manage your work history and timeline.</p>
        </div>
        <Link href="/admin/experiences/new" className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/25 hover:-translate-y-0.5">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Experience
        </Link>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-white/5 text-slate-400 text-xs uppercase border-b border-white/5">
              <tr>
                <th className="px-6 py-4 font-medium">Role & Company</th>
                <th className="px-6 py-4 font-medium">Timeline</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {experiences.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                    No experiences found. Add one to get started!
                  </td>
                </tr>
              ) : (
                experiences.map((exp) => (
                  <tr key={exp.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">{exp.role}</div>
                      <div className="text-slate-400 text-xs mt-0.5">{exp.company}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="whitespace-nowrap">
                        {new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} -{' '}
                        {exp.isCurrent ? 'Present' : exp.endDate ? new Date(exp.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Unknown'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {exp.isCurrent ? (
                        <Badge variant="teal">Current</Badge>
                      ) : (
                        <Badge variant="muted">Past</Badge>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          href={`/admin/experiences/${exp.id}`}
                          className="text-indigo-400 hover:text-indigo-300 transition-colors"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(exp.id)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
