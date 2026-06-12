'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import { StripeForm } from '@/components/checkout/StripeForm'
import { PayPalButton } from '@/components/checkout/PayPalButton'
import { useCartStore } from '@/store/cart'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function CheckoutPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const { items, total, clearCart } = useCartStore()
  const [method, setMethod] = useState<'stripe' | 'paypal'>('stripe')
  const [error, setError] = useState('')

  const createOrder = async (paymentMethod: string, paymentId: string) => {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items, paymentMethod, paymentId }),
    })
    if (!res.ok) {
      setError('Error al registrar el pedido')
      return
    }
    clearCart()
    router.push('/checkout/success')
  }

  if (!items.length) {
    router.push('/cart')
    return null
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="section-title mb-8">Finalizar compra</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Payment */}
        <div>
          <h2 className="font-display text-xl font-semibold mb-6">Método de pago</h2>

          {/* Method selector */}
          <div className="flex gap-3 mb-6">
            {(['stripe', 'paypal'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMethod(m)}
                className={`flex-1 py-3 px-4 rounded-sm border text-sm font-medium transition-all ${
                  method === m
                    ? 'border-accent text-accent bg-accent/5'
                    : 'border-white/10 text-white/50 hover:border-white/20'
                }`}
              >
                {m === 'stripe' ? '💳 Tarjeta de crédito' : '🅿 PayPal'}
              </button>
            ))}
          </div>

          {error && (
            <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-sm px-3 py-2 mb-4">
              {error}
            </p>
          )}

          {method === 'stripe' && (
            <Elements
              stripe={stripePromise}
              options={{
                mode: 'payment',
                amount: Math.round(total() * 100),
                currency: 'usd',
              }}
            >
              <StripeForm onSuccess={(id) => createOrder('stripe', id)} />
            </Elements>
          )}

          {method === 'paypal' && (
            <div className="space-y-4">
              <p className="text-sm text-white/40">
                Al hacer clic en el botón serás redirigido a PayPal para completar el pago.
              </p>
              <PayPalButton
                onSuccess={(id) => createOrder('paypal', id)}
                onError={setError}
              />
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="card p-6 h-fit">
          <h2 className="font-display text-xl font-semibold mb-6">Tu pedido</h2>
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.productId} className="flex justify-between text-sm">
                <span className="text-white/60 truncate max-w-[220px]">
                  {item.name} <span className="text-white/30">×{item.quantity}</span>
                </span>
                <span className="text-white/80 ml-4">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-white/10 mt-6 pt-4 flex justify-between items-center">
            <span className="text-white/60">Total</span>
            <span className="price text-2xl">${total().toFixed(2)}</span>
          </div>
          {session && (
            <p className="text-xs text-white/30 mt-4">
              Comprando como <span className="text-white/50">{session.user.email}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
