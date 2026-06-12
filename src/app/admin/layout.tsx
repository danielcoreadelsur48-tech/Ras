import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') redirect('/')

  const links = [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/products', label: 'Productos' },
    { href: '/admin/categories', label: 'Categorías' },
    { href: '/admin/members', label: 'Miembros' },
    { href: '/admin/banners', label: 'Banners' },
    { href: '/admin/flayers', label: 'Flayers' },
    { href: '/admin/sponsors', label: 'Sponsors' },
  ]

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 bg-surface border-r border-white/5 p-6">
        <div className="mb-8">
          <span className="font-display text-lg font-bold text-gold">RAS</span>
          <span className="text-xs text-white/30 ml-2 uppercase tracking-widest">Admin</span>
        </div>
        <nav className="space-y-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block px-3 py-2 text-sm text-white/60 hover:text-accent hover:bg-accent/5 rounded-sm transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <div className="border-t border-white/5 pt-2 mt-4">
            <Link
              href="/"
              className="block px-3 py-2 text-sm text-white/30 hover:text-white/60 rounded-sm transition-colors"
            >
              ← Volver a la tienda
            </Link>
          </div>
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  )
}
