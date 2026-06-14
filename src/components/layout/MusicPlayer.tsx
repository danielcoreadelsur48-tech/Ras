'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

type PlayerMode = 'playlist' | 'radio'
type PlaybackStatus = 'idle' | 'loading' | 'playing' | 'paused' | 'error'

interface Track {
  id: string
  title: string
  artist: string
  genre: string
  duration: number
  url: string
  coverUrl: string
}

interface RadioStation {
  id: string
  name: string
  genre: string
  country: string
  url: string
}

function formatTime(s: number): string {
  if (!isFinite(s) || isNaN(s) || s < 0) return '--:--'
  return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`
}

const RADIO_STATIONS: RadioStation[] = [
  { id: 'groove', name: 'Groove Salad', genre: 'Electronic/Ambient', country: 'US', url: 'https://ice2.somafm.com/groovesalad-128-mp3' },
  { id: 'indie', name: 'Indie Pop Rocks!', genre: 'Indie Pop', country: 'US', url: 'https://ice2.somafm.com/indiepop-128-mp3' },
  { id: 'beat', name: 'Beat Blender', genre: 'Deep House', country: 'US', url: 'https://ice2.somafm.com/beatblender-128-mp3' },
  { id: 'lush', name: 'Lush', genre: 'Indie/Shoegaze', country: 'US', url: 'https://ice2.somafm.com/lush-128-mp3' },
  { id: 'drone', name: 'Drone Zone', genre: 'Ambient', country: 'US', url: 'https://ice2.somafm.com/dronezone-128-mp3' },
  { id: 'bbc', name: 'BBC World Service', genre: 'News/Talk', country: 'UK', url: 'https://stream.live.vc.bbcmedia.co.uk/bbc_world_service' },
  { id: 'favorita', name: 'Radio Favorita', genre: 'Latin Pop', country: 'EC', url: 'https://playerservices.streamtheworld.com/api/livestream-redirect/FAVORITA_SC' },
  { id: 'tropicana', name: 'Tropicana Colombia', genre: 'Tropical/Salsa', country: 'CO', url: 'https://18763.live.streamtheworld.com/TROPICANA_COL_SC' },
]

const DEMO_TRACKS: Track[] = [
  { id: 't1', title: 'Pista Demo 1', artist: 'Artista RAS', genre: 'Electrónica', duration: 0, url: '', coverUrl: '' },
  { id: 't2', title: 'Pista Demo 2', artist: 'Artista RAS', genre: 'Hip Hop', duration: 0, url: '', coverUrl: '' },
  { id: 't3', title: 'Pista Demo 3', artist: 'DJ Colaborador', genre: 'House', duration: 0, url: '', coverUrl: '' },
  { id: 't4', title: 'Pista Demo 4', artist: 'Productor RAS', genre: 'Afrobeat', duration: 0, url: '', coverUrl: '' },
  { id: 't5', title: 'Pista Demo 5', artist: 'Artista RAS', genre: 'Ambient', duration: 0, url: '', coverUrl: '' },
]

// ── SVG icons (inline, no dependency) ─────────────────────────────────────────

function IconMusic({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z" />
    </svg>
  )
}

function IconPlay({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <polygon points="5,3 19,12 5,21" />
    </svg>
  )
}

function IconPause({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <rect x="6" y="4" width="4" height="16" />
      <rect x="14" y="4" width="4" height="16" />
    </svg>
  )
}

function IconSkipBack({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <polygon points="19,20 9,12 19,4" />
      <line x1="5" y1="19" x2="5" y2="5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function IconSkipForward({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <polygon points="5,4 15,12 5,20" />
      <line x1="19" y1="5" x2="19" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function IconVolume({ className, muted }: { className?: string; muted: boolean }) {
  return muted ? (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11,5 6,9 2,9 2,15 6,15 11,19" fill="currentColor" stroke="none" />
      <line x1="23" y1="9" x2="17" y2="15" />
      <line x1="17" y1="9" x2="23" y2="15" />
    </svg>
  ) : (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11,5 6,9 2,9 2,15 6,15 11,19" fill="currentColor" stroke="none" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  )
}

function IconChevronUp({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="18,15 12,9 6,15" />
    </svg>
  )
}

function IconMinus({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}

function IconSpinner({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
      <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
    </svg>
  )
}

// ── Component ──────────────────────────────────────────────────────────────────

export function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [mounted, setMounted] = useState(false)
  const [minimized, setMinimized] = useState(false)
  const [panelOpen, setPanelOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'emisoras' | 'artistas'>('emisoras')
  const [mode, setMode] = useState<PlayerMode>('radio')
  const [status, setStatus] = useState<PlaybackStatus>('idle')
  const [currentTrackId, setCurrentTrackId] = useState<string | null>(null)
  const [currentStationId, setCurrentStationId] = useState<string | null>(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [isMuted, setIsMuted] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Derived
  const activeTrack = DEMO_TRACKS.find(t => t.id === currentTrackId) ?? null
  const activeStation = RADIO_STATIONS.find(s => s.id === currentStationId) ?? null
  const isLive = mode === 'radio'
  const isPlaying = status === 'playing'
  const playableTracks = DEMO_TRACKS.filter(t => t.url !== '')

  // ── Mount: create Audio element + restore volume ───────────────────────────
  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem('ras-player-volume')
    if (saved !== null) {
      const v = parseFloat(saved)
      if (!isNaN(v)) setVolume(v)
    }
    audioRef.current = new Audio()
    audioRef.current.preload = 'none'
    return () => {
      audioRef.current?.pause()
      audioRef.current = null
    }
  }, [])

  // ── Wire audio events ──────────────────────────────────────────────────────
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const onPlaying = () => { setStatus('playing'); setErrorMessage(null) }
    const onPause = () => setStatus('paused')
    const onWaiting = () => setStatus('loading')
    const onTimeUpdate = () => setCurrentTime(audio.currentTime)
    const onDurationChange = () => setDuration(audio.duration)
    const onEnded = () => handleTrackEnded()
    const onError = () => {
      setStatus('error')
      setErrorMessage('Stream no disponible')
    }

    audio.addEventListener('playing', onPlaying)
    audio.addEventListener('pause', onPause)
    audio.addEventListener('waiting', onWaiting)
    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('durationchange', onDurationChange)
    audio.addEventListener('ended', onEnded)
    audio.addEventListener('error', onError)

    return () => {
      audio.removeEventListener('playing', onPlaying)
      audio.removeEventListener('pause', onPause)
      audio.removeEventListener('waiting', onWaiting)
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('durationchange', onDurationChange)
      audio.removeEventListener('ended', onEnded)
      audio.removeEventListener('error', onError)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted])

  // ── Sync volume ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!audioRef.current) return
    audioRef.current.volume = isMuted ? 0 : volume
    localStorage.setItem('ras-player-volume', String(volume))
  }, [volume, isMuted])

  // ── Playback controls ──────────────────────────────────────────────────────

  const playStation = useCallback((stationId: string) => {
    const station = RADIO_STATIONS.find(s => s.id === stationId)
    if (!station || !audioRef.current) return
    setErrorMessage(null)
    setMode('radio')
    setCurrentStationId(stationId)
    setCurrentTrackId(null)
    setCurrentTime(0)
    setDuration(0)
    setStatus('loading')
    audioRef.current.src = station.url
    audioRef.current.load()
    audioRef.current.play().catch(() => setStatus('error'))
  }, [])

  const playTrack = useCallback((trackId: string) => {
    const track = DEMO_TRACKS.find(t => t.id === trackId)
    if (!track || !track.url || !audioRef.current) return
    setErrorMessage(null)
    setMode('playlist')
    setCurrentTrackId(trackId)
    setCurrentStationId(null)
    setCurrentTime(0)
    setDuration(0)
    setStatus('loading')
    audioRef.current.src = track.url
    audioRef.current.load()
    audioRef.current.play().catch(() => setStatus('error'))
  }, [])

  const handleTrackEnded = useCallback(() => {
    if (mode !== 'playlist' || !playableTracks.length) return
    const idx = playableTracks.findIndex(t => t.id === currentTrackId)
    const next = playableTracks[(idx + 1) % playableTracks.length]
    playTrack(next.id)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, currentTrackId, playableTracks.length])

  const togglePlayPause = useCallback(() => {
    const audio = audioRef.current
    if (!audio || !audio.src) return
    if (status === 'playing') {
      audio.pause()
    } else {
      if (isLive) {
        // Reconnect to live head on resume
        audio.load()
      }
      audio.play().catch(() => setStatus('error'))
    }
  }, [status, isLive])

  const nextTrack = useCallback(() => {
    if (!playableTracks.length) return
    const idx = playableTracks.findIndex(t => t.id === currentTrackId)
    playTrack(playableTracks[(idx + 1) % playableTracks.length].id)
  }, [currentTrackId, playTrack, playableTracks])

  const prevTrack = useCallback(() => {
    if (!playableTracks.length) return
    const idx = playableTracks.findIndex(t => t.id === currentTrackId)
    playTrack(playableTracks[(idx - 1 + playableTracks.length) % playableTracks.length].id)
  }, [currentTrackId, playTrack, playableTracks])

  const seek = useCallback((time: number) => {
    if (!audioRef.current || isLive) return
    audioRef.current.currentTime = time
    setCurrentTime(time)
  }, [isLive])

  // ── SSR guard ──────────────────────────────────────────────────────────────
  if (!mounted) return null

  // ── Minimized floating button ──────────────────────────────────────────────
  if (minimized) {
    return (
      <button
        onClick={() => setMinimized(false)}
        className="fixed bottom-4 right-4 z-40 w-12 h-12 rounded-full
                   bg-[#1a1a1a] border border-white/10 shadow-xl
                   flex items-center justify-center text-[#6ed1fd]
                   hover:border-[#6ed1fd]/40 transition-all duration-200"
        aria-label="Abrir reproductor"
      >
        <IconMusic className="w-5 h-5" />
        {isPlaying && (
          <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-red-500 border-2 border-[#0a0a0a] animate-pulse" />
        )}
      </button>
    )
  }

  // ── Info displayed in the bar ──────────────────────────────────────────────
  const barTitle = isLive
    ? (activeStation?.name ?? 'Selecciona una emisora')
    : (activeTrack?.title ?? 'Selecciona una pista')

  const barSubtitle = isLive
    ? (activeStation?.genre ?? '')
    : (activeTrack?.artist ?? '')

  const hasSource = isLive ? currentStationId !== null : currentTrackId !== null

  // ── Main render ────────────────────────────────────────────────────────────
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40">

      {/* ── Expandable panel ──────────────────────────────────────────────── */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-out
                    bg-[#1a1a1a] border border-white/10 border-b-0
                    ${panelOpen ? 'max-h-[420px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}
      >
        {/* Tabs */}
        <div className="flex border-b border-white/10">
          <button
            onClick={() => setActiveTab('emisoras')}
            className={`flex-1 py-3 text-sm font-medium transition-colors duration-150
                        ${activeTab === 'emisoras' ? 'text-[#6ed1fd] border-b-2 border-[#6ed1fd]' : 'text-white/40 hover:text-white/70'}`}
          >
            Emisoras en vivo
          </button>
          <button
            onClick={() => setActiveTab('artistas')}
            className={`flex-1 py-3 text-sm font-medium transition-colors duration-150
                        ${activeTab === 'artistas' ? 'text-[#6ed1fd] border-b-2 border-[#6ed1fd]' : 'text-white/40 hover:text-white/70'}`}
          >
            Artistas
          </button>
        </div>

        {/* Tab content */}
        <div className="overflow-y-auto max-h-[356px]">

          {/* Emisoras list */}
          {activeTab === 'emisoras' && (
            <ul className="divide-y divide-white/5">
              {RADIO_STATIONS.map(station => {
                const isActive = currentStationId === station.id && mode === 'radio'
                return (
                  <li
                    key={station.id}
                    onClick={() => playStation(station.id)}
                    className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors duration-150
                                hover:bg-[#242424]
                                ${isActive ? 'bg-[#242424]' : ''}`}
                  >
                    {/* Live pulse or placeholder dot */}
                    <span className={`w-2 h-2 rounded-full flex-shrink-0
                                      ${isActive && isPlaying ? 'bg-red-500 animate-pulse' : 'bg-white/10'}`} />

                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${isActive ? 'text-[#6ed1fd]' : 'text-white'}`}>
                        {station.name}
                      </p>
                      <p className="text-xs text-white/40 truncate">{station.genre} · {station.country}</p>
                    </div>

                    <span className="text-[10px] text-red-400 border border-red-500/30 px-1.5 py-0.5 rounded-full flex-shrink-0 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                      EN VIVO
                    </span>
                  </li>
                )
              })}
            </ul>
          )}

          {/* Artistas list */}
          {activeTab === 'artistas' && (
            <ul className="divide-y divide-white/5">
              {DEMO_TRACKS.map((track, i) => {
                const isActive = currentTrackId === track.id && mode === 'playlist'
                const playable = track.url !== ''
                return (
                  <li
                    key={track.id}
                    onClick={() => playable && playTrack(track.id)}
                    className={`flex items-center gap-3 px-4 py-3 transition-colors duration-150
                                ${playable ? 'cursor-pointer hover:bg-[#242424]' : 'opacity-40 cursor-not-allowed'}
                                ${isActive ? 'bg-[#242424]' : ''}`}
                  >
                    <span className="text-xs text-white/30 w-5 text-right flex-shrink-0 tabular-nums">{i + 1}</span>

                    {/* Cover art */}
                    <div className="w-8 h-8 rounded-sm bg-[#242424] flex-shrink-0 overflow-hidden flex items-center justify-center">
                      {track.coverUrl
                        ? <img src={track.coverUrl} alt={track.title} className="w-full h-full object-cover" />
                        : <IconMusic className="w-4 h-4 text-white/20" />
                      }
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${isActive ? 'text-[#6ed1fd]' : 'text-white'}`}>
                        {track.title}
                      </p>
                      <p className="text-xs text-white/40 truncate">{track.artist} · {track.genre}</p>
                    </div>

                    <span className="text-xs text-white/30 flex-shrink-0 tabular-nums">
                      {playable ? formatTime(track.duration) : 'Pronto'}
                    </span>
                  </li>
                )
              })}

              {/* CTA for artists */}
              <li className="px-4 py-4 text-center">
                <p className="text-xs text-white/30">
                  ¿Eres artista? <a href="/contacto" className="text-[#6ed1fd] hover:underline">Sube tu música</a>
                </p>
              </li>
            </ul>
          )}
        </div>
      </div>

      {/* ── Fixed bottom bar ──────────────────────────────────────────────── */}
      <div
        className="relative h-16 flex items-center gap-2 px-3
                   bg-[#111111] border-t border-white/10"
        style={{ backdropFilter: 'blur(12px)' }}
      >
        {/* Error toast */}
        {errorMessage && (
          <div className="absolute -top-9 left-1/2 -translate-x-1/2 z-10
                          bg-[#242424] border border-red-500/30 text-red-400 text-xs
                          px-3 py-1.5 rounded-full whitespace-nowrap pointer-events-none
                          animate-fade-in">
            ⚠ {errorMessage}
          </div>
        )}

        {/* Cover art / station icon */}
        <div className="w-10 h-10 flex-shrink-0 rounded-sm bg-[#242424] overflow-hidden flex items-center justify-center">
          {mode === 'playlist' && activeTrack?.coverUrl
            ? <img src={activeTrack.coverUrl} alt={activeTrack.title} className="w-full h-full object-cover" />
            : <IconMusic className="w-5 h-5 text-white/20" />
          }
        </div>

        {/* Track / station info */}
        <div className="hidden sm:flex flex-col min-w-0 flex-1 max-w-[160px]">
          <p className="text-sm font-medium truncate leading-tight text-white">
            {barTitle}
          </p>
          <p className="text-xs text-white/40 truncate leading-tight">
            {barSubtitle}
          </p>
        </div>

        {/* EN VIVO badge */}
        {isLive && hasSource && (
          <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-red-400
                           border border-red-500/30 px-1.5 py-0.5 rounded-full flex-shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            EN VIVO
          </span>
        )}

        {/* Controls */}
        <div className="flex items-center gap-0.5 flex-shrink-0 mx-auto sm:mx-0">
          {/* Prev — playlist only */}
          {!isLive && (
            <button
              onClick={prevTrack}
              disabled={!playableTracks.length}
              className="p-2 text-white/40 hover:text-white transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
              aria-label="Anterior"
            >
              <IconSkipBack className="w-4 h-4" />
            </button>
          )}

          {/* Play / Pause */}
          <button
            onClick={hasSource ? togglePlayPause : undefined}
            disabled={!hasSource && status === 'idle'}
            className="w-9 h-9 rounded-full bg-[#6ed1fd] text-black flex items-center justify-center
                       hover:bg-[#9ae4ff] transition-colors flex-shrink-0 disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label={isPlaying ? 'Pausa' : 'Reproducir'}
          >
            {status === 'loading'
              ? <IconSpinner className="w-4 h-4 animate-spin" />
              : isPlaying
                ? <IconPause className="w-4 h-4" />
                : <IconPlay className="w-4 h-4 translate-x-px" />
            }
          </button>

          {/* Next — playlist only */}
          {!isLive && (
            <button
              onClick={nextTrack}
              disabled={!playableTracks.length}
              className="p-2 text-white/40 hover:text-white transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
              aria-label="Siguiente"
            >
              <IconSkipForward className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Progress bar — playlist + desktop only */}
        {!isLive && (
          <div className="hidden md:flex items-center gap-2 flex-1 max-w-xs">
            <span className="text-[11px] text-white/30 w-8 text-right tabular-nums">{formatTime(currentTime)}</span>
            <input
              type="range"
              min={0}
              max={isFinite(duration) && duration > 0 ? duration : 0}
              step={1}
              value={currentTime}
              onChange={e => seek(Number(e.target.value))}
              className="player-range flex-1 cursor-pointer"
              aria-label="Progreso"
            />
            <span className="text-[11px] text-white/30 w-8 tabular-nums">{formatTime(duration)}</span>
          </div>
        )}

        {/* Volume — large desktop only */}
        <div className="hidden lg:flex items-center gap-1.5 flex-shrink-0 w-28">
          <button
            onClick={() => setIsMuted(m => !m)}
            className="text-white/40 hover:text-white transition-colors p-1 flex-shrink-0"
            aria-label={isMuted ? 'Activar sonido' : 'Silenciar'}
          >
            <IconVolume className="w-4 h-4" muted={isMuted} />
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.02}
            value={isMuted ? 0 : volume}
            onChange={e => { setVolume(Number(e.target.value)); setIsMuted(false) }}
            className="player-range flex-1 cursor-pointer"
            aria-label="Volumen"
          />
        </div>

        {/* Panel toggle */}
        <button
          onClick={() => setPanelOpen(p => !p)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm border text-xs font-medium
                      transition-all duration-150 flex-shrink-0
                      ${panelOpen
                        ? 'bg-[#6ed1fd]/10 border-[#6ed1fd]/40 text-[#6ed1fd]'
                        : 'bg-white/5 border-white/10 text-white/60 hover:border-[#6ed1fd]/40 hover:text-[#6ed1fd]'}`}
          aria-label={panelOpen ? 'Cerrar panel' : 'Abrir panel'}
        >
          <IconChevronUp className={`w-3.5 h-3.5 transition-transform duration-200 ${panelOpen ? 'rotate-180' : ''}`} />
          <span className="hidden sm:inline">{panelOpen ? 'Cerrar' : 'Ver más'}</span>
        </button>

        {/* Minimize */}
        <button
          onClick={() => { setMinimized(true); setPanelOpen(false) }}
          className="p-2 text-white/40 hover:text-white transition-colors flex-shrink-0"
          aria-label="Minimizar reproductor"
        >
          <IconMinus className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
