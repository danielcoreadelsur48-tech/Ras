import Link from 'next/link'

export default function SuccessPage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-24 text-center">
      <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-accent/20">
        <svg className="w-10 h-10 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h1 className="font-display text-3xl font-bold text-white mb-4">¡Pedido confirmado!</h1>
      <p className="text-white/50 mb-2">
        Gracias por tu compra. Recibirás un correo de confirmación en breve.
      </p>
      <p className="text-white/30 text-sm mb-10">
        Si tienes alguna pregunta, escríbenos a arte@rasstore007.com
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/products" className="btn-primary">
          Seguir comprando
        </Link>
        <Link href="/" className="btn-secondary">
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}
