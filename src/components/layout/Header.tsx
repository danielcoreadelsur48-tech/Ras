'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useCartStore } from '@/store/cart'
import { CartDrawer } from './CartDrawer'

interface HeaderProps {
  categories: { name: string; slug: string }[]
}

export function Header({ categories }: HeaderProps) {
  const { data: session } = useSession()
  const { itemCount } = useCartStore()
  const [cartOpen, setCartOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const count = itemCount()

  useEffect(() => { setMounted(true) }, [])

  return (
    <>
      <header className="sticky top-0 z-30 bg-[#0a0a0a]/95 backdrop-blur border-b border-white/5">
        {/* Top bar */}
        <div className="border-b border-white/5 py-1.5 text-center text-xs text-white/40">
          Envíos nacionales e internacionales · arte@rasstore007.com
        </div>

        {/* Main nav */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-6">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <img src="/logo-ras.png" alt="Ras Store" className="h-14 w-auto invert" />
          </Link>

          {/* Search — desktop */}
          <form
            className="hidden md:flex flex-1 max-w-xl"
            onSubmit={(e) => {
              e.preventDefault()
              const q = (e.currentTarget.elements.namedItem('q') as HTMLInputElement).value
              if (q) window.location.href = `/products?q=${encodeURIComponent(q)}`
            }}
          >
            <div className="flex w-full">
              <input
                name="q"
                type="search"
                placeholder="Buscar arte, servicios, impresiones..."
                className="flex-1 bg-surface-floating border border-white/10 border-r-0 rounded-l-sm px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-accent transition-colors"
              />
              <button
                type="submit"
                className="bg-accent hover:bg-accent-light text-black px-4 rounded-r-sm transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-2 ml-auto">
            {/* Account */}
            {mounted && session ? (
              <div className="relative hidden md:block group">
                <button className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors px-3 py-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>{session.user.name?.split(' ')[0] ?? 'Mi cuenta'}</span>
                </button>
                <div className="absolute right-0 top-full mt-1 w-48 bg-surface-floating border border-white/10 rounded-sm shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  {session.user.role === 'ADMIN' && (
                    <Link
                      href="/admin"
                      className="block px-4 py-2.5 text-sm text-gold hover:bg-white/5 transition-colors"
                    >
                      Panel Admin
                    </Link>
                  )}
                  <Link
                    href="/orders"
                    className="block px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    Mis pedidos
                  </Link>
                  <Link
                    href="/cuenta"
                    className="block px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    Mi cuenta
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="w-full text-left px-4 py-2.5 text-sm text-white/50 hover:text-white hover:bg-white/5 transition-colors border-t border-white/5"
                  >
                    Cerrar sesión
                  </button>
                </div>
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden md:flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors px-3 py-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Ingresar
              </Link>
            )}

            {/* Cart */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative flex items-center gap-1.5 text-white/70 hover:text-accent transition-colors p-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {mounted && count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-accent text-black text-[10px] font-bold rounded-full flex items-center justify-center">
                  {count > 9 ? '9+' : count}
                </span>
              )}
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden text-white/60 hover:text-white p-2 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Category nav */}
        <nav className="border-t border-white/5 overflow-x-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex gap-1">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/products?categoria=${cat.slug}`}
                className="whitespace-nowrap text-sm text-white/50 hover:text-accent px-3 py-2.5 transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </nav>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-white/5 bg-surface-elevated p-4 space-y-3">
            {mounted && session ? (
              <>
                <p className="text-sm text-white/40 px-2">Hola, {session.user.name}</p>
                {session.user.role === 'ADMIN' && (
                  <Link href="/admin" onClick={() => setMenuOpen(false)} className="block text-gold px-2 py-1.5 text-sm">Panel Admin</Link>
                )}
                <Link href="/orders" onClick={() => setMenuOpen(false)} className="block text-white/70 px-2 py-1.5 text-sm">Mis pedidos</Link>
                <Link href="/cuenta" onClick={() => setMenuOpen(false)} className="block text-white/70 px-2 py-1.5 text-sm">Mi cuenta</Link>
                <button onClick={() => signOut()} className="block text-white/50 px-2 py-1.5 text-sm">Cerrar sesión</button>
              </>
            ) : (
              <Link href="/login" onClick={() => setMenuOpen(false)} className="block btn-secondary text-center">
                Ingresar
              </Link>
            )}
          </div>
        )}
      </header>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  )
}
