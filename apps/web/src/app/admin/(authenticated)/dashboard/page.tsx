'use client'

import { useEffect, useState } from 'react'
import { Card } from '@portfolio/ui'
import { getAdminSkills, getAdminExperiences, getAdminProjects } from '@/lib/admin-api'

interface DashboardStats {
  skills: number
  experiences: number
  projects: number
}

const API_URL = process.env['NEXT_PUBLIC_API_URL'] ?? 'http://localhost:3001'

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      try {
        const [skills, experiences, projects] = await Promise.all([
          getAdminSkills().catch(() => []),
          getAdminExperiences().catch(() => []),
          getAdminProjects().catch(() => []),
        ])

        setStats({
          skills: skills.length,
          experiences: experiences.length,
          projects: projects.length,
        })
      } catch {
        // fail silently for stats
      } finally {
        setLoading(false)
      }
    }

    void loadStats()
  }, [])

  if (loading) {
    return <div className="animate-pulse flex space-x-4">Loading stats...</div>
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Dashboard Overview</h1>
        <p className="text-slate-500 text-sm">Manage your portfolio content</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {[
          { label: 'Total Skills', value: stats?.skills ?? 0, icon: '💡', color: 'from-accent-500/20 to-accent-600/10' },
          { label: 'Experiences', value: stats?.experiences ?? 0, icon: '💼', color: 'from-teal-500/20 to-teal-600/10' },
          { label: 'Projects', value: stats?.projects ?? 0, icon: '🚀', color: 'from-purple-500/20 to-purple-600/10' },
        ].map((stat) => (
          <Card
            key={stat.label}
            className={`p-6 bg-gradient-to-br ${stat.color} border-transparent`}
          >
            <div className="text-2xl mb-2">{stat.icon}</div>
            <div className="text-3xl font-extrabold text-white mb-1">{stat.value}</div>
            <div className="text-sm text-slate-400">{stat.label}</div>
          </Card>
        ))}
      </div>

      <Card className="p-6 border border-accent-500/20 bg-accent-500/5">
        <h2 className="text-base font-semibold text-accent-300 mb-2 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Phase 2 Active
        </h2>
        <p className="text-slate-400 text-sm leading-relaxed">
          Welcome to the new Admin Panel. You can now fully manage your Skills, Experiences, Projects, and Site Settings.
        </p>
        <div className="mt-4 flex gap-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white transition-all duration-200"
          >
            View Portfolio Site
          </a>
          <a
            href={`${API_URL}/api`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold rounded-xl border border-white/10 text-slate-300 hover:text-white hover:border-white/20 transition-all duration-200"
          >
            API Base URL
          </a>
        </div>
      </Card>
    </>
  )
}
