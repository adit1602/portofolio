import ProjectForm from '../ProjectForm'

export default function NewProjectPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Add New Project</h1>
        <p className="text-slate-500 text-sm">Create a new project entry for your portfolio.</p>
      </div>
      <ProjectForm />
    </div>
  )
}
