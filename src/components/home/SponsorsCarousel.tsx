'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import type { Sponsor } from '@/types'

interface Props {
  sponsors: Sponsor[]
}

export function SponsorsCarousel({ sponsors }: Props) {
  const active = sponsors.filter((s) => s.active).sort((a, b) => a.position - b.position)
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const [cardW, setCardW] = useState(280)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Duplicamos para loop infinito suave
  const items = active.length > 0 ? [...active, ...active] : []
  const total = active.length

  useEffect(() => {
    const update = () => setCardW(window.innerWidth < 640 ? window.innerWidth - 32 : 280)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  useEffect(() => {
    if (total <= 1 || paused) return
    timerRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % total)
    }, 3000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [total, paused])

  if (!active.length) return null

  return (
    <section className="py-14 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-xs font-semibold tracking-[0.2em] text-[#6ed1fd]/60 uppercase mb-2">ALIADOS</p>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-white">
            Nuestros <span className="text-[#6ed1fd]">Sponsors</span>
          </h2>
        </div>

        {/* Carrusel */}
        <div
          className="relative"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Fade laterales */}
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#0a0a0a] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#0a0a0a] to-transparent z-10 pointer-events-none" />

          <div className="overflow-hidden">
            <div
              className="flex gap-5 transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(calc(-${current * (cardW + 20)}px))` }}
            >
              {items.map((sponsor, i) => {
                const card = (
                  <div
                    key={`${sponsor.id}-${i}`}
                    className="flex-shrink-0 group"
                    style={{ width: cardW }}
                  >
                    <div className="relative h-40 rounded-sm bg-[#111] border border-white/5 group-hover:border-[#c9a227]/40 transition-all duration-300 flex items-center justify-center p-5 overflow-hidden">
                      {/* Brillo en hover */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-[#c9a227]/5 to-transparent" />
                      <img
                        src={sponsor.image}
                        alt={sponsor.name}
                        className="max-w-full max-h-full object-contain opacity-90 group-hover:opacity-100 transition-opacity duration-300 relative z-10"
                      />
                    </div>
                    <p className="text-center text-xs text-white/30 group-hover:text-white/60 transition-colors mt-2 truncate">
                      {sponsor.name}
                    </p>
                  </div>
                )

                return sponsor.link ? (
                  <Link href={sponsor.link} target="_blank" rel="noopener noreferrer" key={`${sponsor.id}-${i}`} className="flex-shrink-0 group block" style={{ width: cardW }}>
                    <div className="relative h-40 rounded-sm bg-[#111] border border-white/5 group-hover:border-[#c9a227]/40 transition-all duration-300 flex items-center justify-center p-5 overflow-hidden">
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-[#c9a227]/5 to-transparent" />
                      <img
                        src={sponsor.image}
                        alt={sponsor.name}
                        className="max-w-full max-h-full object-contain opacity-90 group-hover:opacity-100 transition-opacity duration-300 relative z-10"
                      />
                    </div>
                    <p className="text-center text-xs text-white/30 group-hover:text-white/60 transition-colors mt-2 truncate">
                      {sponsor.name}
                    </p>
                  </Link>
                ) : (
                  <div key={`${sponsor.id}-${i}`} className="flex-shrink-0 group" style={{ width: cardW }}>
                    <div className="relative h-40 rounded-sm bg-[#111] border border-white/5 group-hover:border-[#c9a227]/40 transition-all duration-300 flex items-center justify-center p-5 overflow-hidden">
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-[#c9a227]/5 to-transparent" />
                      <img
                        src={sponsor.image}
                        alt={sponsor.name}
                        className="max-w-full max-h-full object-contain opacity-90 group-hover:opacity-100 transition-opacity duration-300 relative z-10"
                      />
                    </div>
                    <p className="text-center text-xs text-white/30 group-hover:text-white/60 transition-colors mt-2 truncate">
                      {sponsor.name}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Dots */}
          {total > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {active.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-1 rounded-full transition-all duration-300 ${i === current ? 'w-6 bg-[#c9a227]' : 'w-2 bg-white/20 hover:bg-white/40'}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Borde degradado inferior */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#c9a227]/30 to-transparent mt-10" />
    </section>
  )
}
