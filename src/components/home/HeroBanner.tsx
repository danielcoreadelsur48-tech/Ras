'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Banner } from '@/types'

interface HeroBannerProps {
  banners: Banner[]
}

export function HeroBanner({ banners }: HeroBannerProps) {
  const [current, setCurrent] = useState(0)
  const active = banners.filter((b) => b.active)

  useEffect(() => {
    if (active.length <= 1) return
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % active.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [active.length])

  if (!active.length) return null

  const banner = active[current]

  return (
    <div className="relative w-full h-[260px] sm:h-[380px] md:h-[520px] overflow-hidden bg-surface">
      <Image
        src={banner.image}
        alt={banner.title ?? 'Banner'}
        fill
        className="object-cover opacity-90 transition-opacity duration-700"
        priority
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
          <div className="max-w-xl animate-fade-in">
            {banner.subtitle && (
              <p className="section-subtitle mb-3">{banner.subtitle}</p>
            )}
            {banner.title && (
              <h1 className="font-display text-2xl sm:text-4xl md:text-6xl font-bold text-white leading-tight mb-3 md:mb-6">
                {banner.title}
              </h1>
            )}
            {banner.link && (
              <Link href={banner.link} className="btn-primary inline-flex">
                {banner.buttonLabel ?? 'Explorar colección'}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Dots */}
      {active.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {active.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-1 rounded-full transition-all duration-300 ${i === current ? 'w-8 bg-accent' : 'w-2 bg-white/30'}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
