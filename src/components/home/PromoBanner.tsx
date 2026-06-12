import Link from 'next/link'

export function PromoBanner() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <style>{`
        @keyframes vipGlow {
          0%, 100% {
            box-shadow: 0 0 14px 4px rgba(201,162,39,0.32), 0 0 45px 10px rgba(201,162,39,0.10);
          }
          50% {
            box-shadow: 0 0 26px 8px rgba(201,162,39,0.58), 0 0 70px 18px rgba(201,162,39,0.18);
          }
        }
        .vip-btn {
          animation: vipGlow 2s ease-in-out infinite;
        }
        .vip-btn:hover {
          animation: none;
          box-shadow: 0 0 45px 14px rgba(201,162,39,0.78), 0 0 100px 28px rgba(201,162,39,0.32);
          transition: box-shadow 0.3s ease;
        }
      `}</style>

      <div className="relative overflow-hidden rounded-sm bg-gradient-to-r from-[#1a1200] to-[#0a0a0a] border border-gold/20 p-8 md:p-12">
        {/* Background pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, #c9a227 1px, transparent 0)',
            backgroundSize: '32px 32px',
          }}
        />

        <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-gold/10 text-gold border border-gold/20 text-xs px-3 py-1 rounded-full mb-4">
              <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20">
                <path d="M10 1l2.39 4.84L18 7.11l-4 3.9.94 5.49L10 14.04l-4.94 2.46L6 10.01 2 7.11l5.61-.27L10 1z" />
              </svg>
              Club de Miembros
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-3">
              Acceso exclusivo a<br />
              <span className="text-gold">arte premium</span>
            </h2>
            <p className="text-white/50 max-w-md">
              Regístrate y desbloquea productos exclusivos, precios especiales y contenido
              para miembros. Únete a la comunidad Ras Store.
            </p>
          </div>
          <div className="flex-shrink-0 flex flex-col sm:flex-row gap-3">
            <Link href="/products/prod_006" className="btn-primary vip-btn">
              Obtén el VIP
            </Link>
            <Link href="/products?memberOnly=true" className="btn-secondary">
              Ver exclusivos
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
