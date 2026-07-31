import ExperienceForm from '../ExperienceForm'

export default function NewExperiencePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Add New Experience</h1>
        <p className="text-slate-500 text-sm">Add a new role or position to your timeline.</p>
      </div>
      <ExperienceForm />
    </div>
  )
}
