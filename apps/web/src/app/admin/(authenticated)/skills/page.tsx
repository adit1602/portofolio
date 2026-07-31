'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, Button, Badge } from '@portfolio/ui'
import { getAdminSkills, deleteSkill, Skill } from '@/lib/admin-api'

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function loadSkills() {
    setLoading(true)
    try {
      const data = await getAdminSkills()
      setSkills(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadSkills()
  }, [])

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this skill?')) return
    
    try {
      await deleteSkill(id)
      await loadSkills()
    } catch (err: any) {
      alert(err.message)
    }
  }

  if (loading) {
    return <div className="text-slate-400">Loading skills...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Skills</h1>
          <p className="text-slate-500 text-sm">Manage your portfolio skills and technologies.</p>
        </div>
        <Link href="/admin/skills/new" className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/25 hover:-translate-y-0.5">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Skill
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
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Level</th>
                <th className="px-6 py-4 font-medium">Order</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {skills.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    No skills found. Add one to get started!
                  </td>
                </tr>
              ) : (
                skills.map((skill) => (
                  <tr key={skill.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-medium text-white">
                      {skill.name}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="muted">{skill.category?.name ?? 'Unknown'}</Badge>
                    </td>
                    <td className="px-6 py-4">
                      {skill.level} / 5
                    </td>
                    <td className="px-6 py-4 text-slate-400">
                      {skill.order}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          href={`/admin/skills/${skill.id}`}
                          className="text-indigo-400 hover:text-indigo-300 transition-colors"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(skill.id)}
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
