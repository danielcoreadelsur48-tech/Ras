'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import { StripeVipForm } from '@/components/membership/StripeVipForm'
import { PayPalVipButton } from '@/components/membership/PayPalVipButton'
import Link from 'next/link'

const VIP_PRICE = 9.99
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

const BENEFITS = [
  'Acceso completo a todos los productos exclusivos',
  'Precios y descripciones visibles sin restricción',
  'Imágenes nítidas en toda la galería VIP',
  'Prioridad en nuevos lanzamientos y ediciones limitadas',
  'Descuentos exclusivos para miembros VIP',
]

export default function MembershipPage() {
  const { data: session, status } = useSession()
  const [payMethod, setPayMethod] = useState<'stripe' | 'paypal'>('stripe')
  const [success, setSuccess] = useState(false)
  const [payError, setPayError] = useState('')

  const isVip = session?.user.role === 'VIP' || session?.user.role === 'ADMIN'

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/20 rounded-full px-4 py-1.5 mb-6">
          <svg className="w-4 h-4 text-gold" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="text-gold text-sm font-medium">Membresía VIP</span>
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
          Acceso completo al arte exclusivo
        </h1>
        <p className="text-white/50 text-lg max-w-xl mx-auto">
          Desbloquea todos los productos, precios y colecciones reservadas para miembros VIP.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Benefits */}
        <div className="card p-8">
          <h2 className="font-display text-xl font-bold text-white mb-6">¿Qué incluye?</h2>
          <ul className="space-y-4">
            {BENEFITS.map((benefit, i) => (
              <li key={i} className="flex items-start gap-3">
                <svg className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-white/70 text-sm">{benefit}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8 pt-6 border-t border-white/5">
            <div className="flex items-end gap-2">
              <span className="font-display text-4xl font-bold text-gold">${VIP_PRICE}</span>
              <span className="text-white/30 text-sm mb-1">USD — pago único</span>
            </div>
          </div>
        </div>

        {/* Payment / Status */}
        <div className="card p-8">
          {success ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-gold/20">
                <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-display text-2xl font-bold text-white mb-2">¡Bienvenido al VIP!</h3>
              <p className="text-white/50 text-sm mb-6">Ya tienes acceso completo a todos los productos exclusivos.</p>
              <Link href="/products" className="btn-primary inline-block">
                Explorar productos VIP
              </Link>
            </div>
          ) : isVip ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-gold/20">
                <svg className="w-8 h-8 text-gold" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <h3 className="font-display text-xl font-bold text-white mb-2">Ya eres miembro VIP</h3>
              <p className="text-white/50 text-sm mb-6">Tienes acceso completo a todo el contenido exclusivo.</p>
              <Link href="/products" className="btn-primary inline-block">
                Ver productos
              </Link>
            </div>
          ) : !session ? (
            <div className="text-center py-4">
              <p className="text-white/50 text-sm mb-6">Debes iniciar sesión para adquirir la membresía VIP.</p>
              <Link href="/login" className="btn-primary inline-block mb-3">
                Ingresar
              </Link>
              <p className="text-white/30 text-xs">
                ¿No tienes cuenta?{' '}
                <Link href="/register" className="text-accent hover:underline">
                  Regístrate gratis
                </Link>
              </p>
            </div>
          ) : (
            <>
              <h2 className="font-display text-xl font-bold text-white mb-6">Método de pago</h2>

              {/* Method selector */}
              <div className="flex gap-2 mb-6">
                <button
                  type="button"
                  onClick={() => setPayMethod('stripe')}
                  className={`flex-1 py-2.5 text-sm rounded-sm border transition-colors ${payMethod === 'stripe' ? 'border-accent bg-accent/10 text-accent' : 'border-white/10 text-white/50 hover:border-white/20'}`}
                >
                  Tarjeta
                </button>
                <button
                  type="button"
                  onClick={() => setPayMethod('paypal')}
                  className={`flex-1 py-2.5 text-sm rounded-sm border transition-colors ${payMethod === 'paypal' ? 'border-accent bg-accent/10 text-accent' : 'border-white/10 text-white/50 hover:border-white/20'}`}
                >
                  PayPal
                </button>
              </div>

              {payError && (
                <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-sm px-3 py-2 mb-4">
                  {payError}
                </p>
              )}

              {payMethod === 'stripe' ? (
                <Elements
                  stripe={stripePromise}
                  options={{
                    mode: 'payment',
                    amount: Math.round(VIP_PRICE * 100),
                    currency: 'usd',
                  }}
                >
                  <StripeVipForm amount={VIP_PRICE} onSuccess={() => setSuccess(true)} />
                </Elements>
              ) : (
                <PayPalVipButton
                  amount={VIP_PRICE}
                  onSuccess={() => setSuccess(true)}
                  onError={(err) => setPayError(err)}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
