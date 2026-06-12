import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-surface border-t border-white/5 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <span className="font-display text-2xl font-bold text-accent">
              RAS<span className="text-white/80">STORE</span>
            </span>
            <p className="mt-3 text-sm text-white/40 leading-relaxed">
              Arte, cultura y servicios creativos. Conectando artistas con el mundo.
            </p>
          </div>

          {/* Catálogo */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-white/40 mb-4">Catálogo</h4>
            <ul className="space-y-2.5">
              {[
                ['Arte Visual', '/products?categoria=arte-visual'],
                ['Arte Digital', '/products?categoria=arte-digital'],
                ['Impresiones', '/products?categoria=impresiones'],
                ['Servicios Creativos', '/products?categoria=servicios-creativos'],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="text-sm text-white/50 hover:text-accent transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Empresa */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-white/40 mb-4">Empresa</h4>
            <ul className="space-y-2.5">
              {[
                ['Quiénes somos', '/about'],
                ['Directorio Cultural', '/directorio'],
                ['Logística', '/productos?categoria=logistica'],
                ['Contacto', '/contacto'],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="text-sm text-white/50 hover:text-accent transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Cuenta */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-white/40 mb-4">Mi cuenta</h4>
            <ul className="space-y-2.5">
              {[
                ['Iniciar sesión', '/login'],
                ['Registrarse', '/register'],
                ['Mis pedidos', '/orders'],
                ['Club de Miembros', '/register'],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="text-sm text-white/50 hover:text-accent transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} Ras Store · rasstore007.com · Todos los derechos reservados
          </p>
          <div className="flex items-center gap-4 text-xs text-white/30">
            <Link href="/privacidad" className="hover:text-white/60 transition-colors">Privacidad</Link>
            <Link href="/terminos" className="hover:text-white/60 transition-colors">Términos</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
