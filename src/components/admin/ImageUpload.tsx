'use client'

import { useRef, useState } from 'react'

interface Props {
  value: string[]
  onChange: (urls: string[]) => void
  multiple?: boolean
}

export function ImageUpload({ value, onChange, multiple = false }: Props) {
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const uploadFile = async (file: File): Promise<string> => {
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/upload', { method: 'POST', body: fd })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error ?? 'Error al subir la imagen')
    return data.url as string
  }

  const handleFiles = async (files: FileList) => {
    setUploading(true)
    try {
      const urls: string[] = []
      for (const file of Array.from(files)) {
        urls.push(await uploadFile(file))
      }
      onChange(multiple ? [...value, ...urls] : [urls[0]])
    } catch (err: any) {
      alert(err.message)
    } finally {
      setUploading(false)
    }
  }

  const remove = (index: number) => onChange(value.filter((_, i) => i !== index))

  return (
    <div className="space-y-3">
      {value.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {value.map((url, i) => (
            <div key={i} className="relative group w-24 h-24 rounded-sm overflow-hidden border border-white/10 flex-shrink-0">
              <img src={url} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => remove(i)}
                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium"
              >
                Quitar
              </button>
            </div>
          ))}
        </div>
      )}

      {(multiple || value.length === 0) && (
        <div
          role="button"
          tabIndex={0}
          className={`border-2 border-dashed border-white/10 rounded-sm p-6 text-center cursor-pointer hover:border-accent/40 transition-colors select-none ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); e.dataTransfer.files.length && handleFiles(e.dataTransfer.files) }}
        >
          <p className="text-white/40 text-sm">
            {uploading ? 'Subiendo…' : 'Haz clic o arrastra una imagen aquí'}
          </p>
          <p className="text-white/20 text-xs mt-1">PNG, JPG, WEBP — máx. 10 MB</p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        className="hidden"
        onChange={(e) => e.target.files?.length && handleFiles(e.target.files)}
      />
    </div>
  )
}
