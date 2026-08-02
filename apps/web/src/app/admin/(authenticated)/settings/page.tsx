'use client'

import { useEffect, useRef, useState } from 'react'
import { Card, Button, Input, Label, Textarea } from '@portfolio/ui'
import { updateSiteSettings, createSocialLink, deleteSocialLink, uploadImage, SocialLink } from '@/lib/admin-api'
import { getSiteSettings, getSocialLinks } from '@/lib/api' // using public fetch for reads to share cache if needed
import { resolveImageUrl } from '@/lib/media'
import ImageCropModal from '@/components/admin/ImageCropModal'
import SocialIcon from '@/components/layout/SocialIcon'

export default function SettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([])
  const [loading, setLoading] = useState(true)
  const [savingSettings, setSavingSettings] = useState(false)
  const [addingLink, setAddingLink] = useState(false)
  const [newLinkIcon, setNewLinkIcon] = useState('')
  const [uploadingLinkIcon, setUploadingLinkIcon] = useState(false)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [photoUrl, setPhotoUrl] = useState('')
  const [cropSrc, setCropSrc] = useState<string | null>(null)
  const photoInputRef = useRef<HTMLInputElement>(null)
  const [uploadingResume, setUploadingResume] = useState(false)
  const [resumeUrl, setResumeUrl] = useState('')
  const [uploadingMusic, setUploadingMusic] = useState(false)
  const [musicUrl, setMusicUrl] = useState('')
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  async function loadData() {
    setLoading(true)
    try {
      const [settingsData, linksData] = await Promise.all([
        getSiteSettings(),
        getSocialLinks()
      ])
      setSettings(settingsData)
      setSocialLinks(linksData)
      setPhotoUrl(settingsData.hero_photo_url ?? '')
      setResumeUrl(settingsData.resume_url ?? '')
      setMusicUrl(settingsData.bg_music_url ?? '')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadData()
  }, [])

  async function handleSaveSettings(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSavingSettings(true)
    setError('')
    setSuccessMsg('')
    
    const formData = new FormData(e.currentTarget)
    const newSettings: Record<string, string> = {}
    formData.forEach((value, key) => {
      newSettings[key] = value as string
    })

    try {
      await updateSiteSettings(newSettings)
      setSettings(newSettings)
      setSuccessMsg('Settings saved successfully!')
      setTimeout(() => setSuccessMsg(''), 3000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSavingSettings(false)
    }
  }

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setCropSrc(URL.createObjectURL(file))
  }

  function closeCropModal() {
    if (cropSrc) URL.revokeObjectURL(cropSrc)
    setCropSrc(null)
    // Allow re-selecting the same file
    if (photoInputRef.current) photoInputRef.current.value = ''
  }

  async function handleCropConfirm(blob: Blob) {
    setUploadingPhoto(true)
    setError('')
    try {
      const file = new File([blob], 'profile-photo.png', { type: 'image/png' })
      const { url } = await uploadImage(file)
      setPhotoUrl(url)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setUploadingPhoto(false)
      closeCropModal()
    }
  }

  async function handleResumeChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingResume(true)
    setError('')
    try {
      const { url } = await uploadImage(file)
      setResumeUrl(url)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setUploadingResume(false)
    }
  }

  async function handleMusicChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingMusic(true)
    setError('')
    try {
      const { url } = await uploadImage(file)
      setMusicUrl(url)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setUploadingMusic(false)
    }
  }

  async function handleAddSocialLink(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setAddingLink(true)
    
    const formData = new FormData(e.currentTarget)
    const data = {
      platform: formData.get('platform') as string,
      url: formData.get('url') as string,
      icon: formData.get('icon') as string,
      order: parseInt(formData.get('order') as string, 10) || 0,
    }

    try {
      await createSocialLink(data)
      const form = e.target as HTMLFormElement
      form.reset()
      setNewLinkIcon('')
      await loadData() // Refresh list
    } catch (err: any) {
      alert('Failed to add link: ' + err.message)
    } finally {
      setAddingLink(false)
    }
  }

  async function handleLinkIconUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingLinkIcon(true)
    try {
      const { url } = await uploadImage(file)
      setNewLinkIcon(url)
    } catch (err: any) {
      alert('Failed to upload icon: ' + err.message)
    } finally {
      setUploadingLinkIcon(false)
      e.target.value = ''
    }
  }

  async function handleDeleteLink(id: string) {
    if (!confirm('Are you sure you want to delete this link?')) return
    
    try {
      await deleteSocialLink(id)
      await loadData()
    } catch (err: any) {
      alert('Failed to delete link: ' + err.message)
    }
  }

  if (loading) {
    return <div className="text-slate-400">Loading settings...</div>
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Global Settings</h1>
        <p className="text-slate-500 text-sm">Manage site configuration and links.</p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}
      {successMsg && (
        <div className="p-4 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 text-sm">
          {successMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Site Settings Form */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-white mb-6">General Information</h2>
          <form onSubmit={handleSaveSettings} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="photoInput">Profile Photo</Label>
              <div className="flex items-center gap-4">
                {photoUrl && (
                  <img
                    src={resolveImageUrl(photoUrl) ?? undefined}
                    alt="Profile preview"
                    className="w-16 h-16 rounded-full object-cover border border-white/10"
                  />
                )}
                <Input
                  id="photoInput"
                  ref={photoInputRef}
                  type="file"
                  accept="image/png, image/jpeg, image/webp, image/gif"
                  onChange={handlePhotoChange}
                  disabled={uploadingPhoto}
                  className="max-w-xs"
                />
                {uploadingPhoto && <span className="text-xs text-slate-500">Uploading...</span>}
              </div>
              {/* Included in the settings save below */}
              <input type="hidden" name="hero_photo_url" value={photoUrl} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hero_name">Name</Label>
              <Input id="hero_name" name="hero_name" defaultValue={settings.hero_name} placeholder="John Doe" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hero_title">Hero Title</Label>
              <Input id="hero_title" name="hero_title" defaultValue={settings.hero_title} placeholder="Backend & DevOps Engineer" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hero_bio">Hero Bio</Label>
              <Textarea id="hero_bio" name="hero_bio" defaultValue={settings.hero_bio} className="min-h-[100px]" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact_email">Contact Email</Label>
              <Input id="contact_email" name="contact_email" type="email" defaultValue={settings.contact_email} placeholder="john@example.com" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="about_text">About Section Text</Label>
              <Textarea id="about_text" name="about_text" defaultValue={settings.about_text} className="min-h-[150px]" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="about_text_2">About Section Text (second paragraph, optional)</Label>
              <Textarea id="about_text_2" name="about_text_2" defaultValue={settings.about_text_2} className="min-h-[100px]" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="resumeInput">Resume / CV (PDF)</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="resumeInput"
                  type="file"
                  accept="application/pdf"
                  onChange={handleResumeChange}
                  disabled={uploadingResume}
                  className="max-w-xs"
                />
                {uploadingResume && <span className="text-xs text-slate-500">Uploading...</span>}
                {resumeUrl && !uploadingResume && (
                  <a
                    href={resolveImageUrl(resumeUrl) ?? undefined}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-indigo-400 hover:underline"
                  >
                    View current file
                  </a>
                )}
              </div>
              <input type="hidden" name="resume_url" value={resumeUrl} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="musicInput">Background Music (MP3/OGG/WAV)</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="musicInput"
                  type="file"
                  accept="audio/mpeg, audio/mp3, audio/wav, audio/ogg"
                  onChange={handleMusicChange}
                  disabled={uploadingMusic}
                  className="max-w-xs"
                />
                {uploadingMusic && <span className="text-xs text-slate-500">Uploading...</span>}
                {musicUrl && !uploadingMusic && (
                  <a
                    href={resolveImageUrl(musicUrl) ?? undefined}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-indigo-400 hover:underline"
                  >
                    Preview current track
                  </a>
                )}
              </div>
              <input type="hidden" name="bg_music_url" value={musicUrl} />
              <p className="text-xs text-slate-500">Leave empty to hide the music toggle on the site.</p>
            </div>

            <Button type="submit" loading={savingSettings}>
              Save Settings
            </Button>
          </form>
        </Card>

        {/* Social Links Form */}
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-white mb-6">Add Social Link</h2>
            <form onSubmit={handleAddSocialLink} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="platform">Platform</Label>
                  <Input id="platform" name="platform" required placeholder="e.g. GitHub" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="icon">Icon</Label>
                  <Input
                    id="icon"
                    name="icon"
                    required
                    value={newLinkIcon}
                    onChange={(e) => setNewLinkIcon(e.target.value)}
                    placeholder="github, linkedin, twitter, website..."
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="iconUpload">Or upload a custom icon (PNG/SVG/WebP)</Label>
                <div className="flex items-center gap-3">
                  <Input
                    id="iconUpload"
                    type="file"
                    accept="image/png, image/svg+xml, image/webp, image/jpeg, image/gif"
                    onChange={handleLinkIconUpload}
                    disabled={uploadingLinkIcon}
                    className="max-w-xs"
                  />
                  {uploadingLinkIcon && <span className="text-xs text-slate-500">Uploading...</span>}
                  {newLinkIcon && !uploadingLinkIcon && (
                    <span className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white shrink-0">
                      <SocialIcon icon={newLinkIcon} platform="preview" />
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500">
                  Only github, linkedin, twitter, and website have built-in icons — anything else
                  needs an uploaded image or shows as text.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="url">URL</Label>
                  <Input id="url" name="url" type="url" required placeholder="https://github.com/..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="order">Display Order</Label>
                  <Input id="order" name="order" type="number" required defaultValue="0" />
                </div>
              </div>
              <Button type="submit" loading={addingLink} variant="ghost" className="w-full">
                Add Link
              </Button>
            </form>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Active Social Links</h2>
            {socialLinks.length === 0 ? (
              <p className="text-sm text-slate-500">No social links added yet.</p>
            ) : (
              <div className="space-y-3">
                {socialLinks.sort((a, b) => a.order - b.order).map(link => (
                  <div key={link.id} className="flex items-center justify-between p-3 rounded-lg border border-white/5 bg-white/5 hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white shrink-0">
                        <SocialIcon icon={link.icon} platform={link.platform} />
                      </span>
                      <div>
                        <div className="text-sm font-medium text-white">{link.platform}</div>
                        <a href={link.url} target="_blank" rel="noreferrer" className="text-xs text-slate-400 hover:text-indigo-400 truncate max-w-[200px] block">
                          {link.url}
                        </a>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteLink(link.id)}
                      className="text-red-400 hover:text-red-300 text-sm p-2"
                      title="Delete"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>

      {cropSrc && (
        <ImageCropModal
          imageSrc={cropSrc}
          aspect={1}
          cropShape="round"
          onCancel={closeCropModal}
          onConfirm={handleCropConfirm}
        />
      )}
    </div>
  )
}
