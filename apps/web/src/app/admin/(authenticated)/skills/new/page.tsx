import SkillForm from '../SkillForm'

export default function NewSkillPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Add New Skill</h1>
        <p className="text-slate-500 text-sm">Create a new skill and assign it to a category.</p>
      </div>
      <SkillForm />
    </div>
  )
}
