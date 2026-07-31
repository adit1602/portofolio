'use client'

import { useCallback, useState } from 'react'
import Cropper from 'react-easy-crop'
import type { Area } from 'react-easy-crop'
import { Button } from '@portfolio/ui'
import { getCroppedImageBlob } from '@/lib/cropImage'

interface ImageCropModalProps {
  imageSrc: string
  aspect?: number
  cropShape?: 'round' | 'rect'
  onCancel: () => void
  onConfirm: (blob: Blob) => void
}

/** Full-screen modal that lets the user pick which part of an image to keep before uploading */
export default function ImageCropModal({
  imageSrc,
  aspect = 1,
  cropShape = 'round',
  onCancel,
  onConfirm,
}: ImageCropModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [processing, setProcessing] = useState(false)

  const handleCropComplete = useCallback((_croppedArea: Area, areaPixels: Area) => {
    setCroppedAreaPixels(areaPixels)
  }, [])

  async function handleConfirm() {
    if (!croppedAreaPixels) return
    setProcessing(true)
    try {
      const blob = await getCroppedImageBlob(imageSrc, croppedAreaPixels)
      onConfirm(blob)
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-slate-800/95 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-5 border-b border-white/5">
          <h3 className="text-base font-semibold text-white">Crop Photo</h3>
          <p className="text-xs text-slate-500 mt-1">Drag to reposition, scroll or use the slider to zoom.</p>
        </div>

        <div className="relative w-full h-80 bg-slate-950">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            cropShape={cropShape}
            showGrid={cropShape === 'rect'}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={handleCropComplete}
          />
        </div>

        <div className="p-5 space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 w-10">Zoom</span>
            <input
              type="range"
              min={1}
              max={3}
              step={0.01}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="flex-1 accent-indigo-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3">
            <Button type="button" variant="ghost" onClick={onCancel} disabled={processing}>
              Cancel
            </Button>
            <Button type="button" onClick={handleConfirm} loading={processing}>
              Use Photo
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
