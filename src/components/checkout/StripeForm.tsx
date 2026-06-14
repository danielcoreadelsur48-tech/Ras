'use client'

import { useState } from 'react'
import {
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import { Button } from '@/components/ui/Button'
import { useCartStore } from '@/store/cart'

interface StripeFormProps {
  onSuccess: (paymentId: string) => void
}

export function StripeForm({ onSuccess }: StripeFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const { total } = useCartStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return

    setLoading(true)
    setError('')

    const { error: submitError } = await elements.submit()
    if (submitError) {
      setError(submitError.message ?? 'Error al procesar el pago')
      setLoading(false)
      return
    }

    const res = await fetch('/api/stripe/create-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: total() }),
    })
    const { clientSecret, error: apiError } = await res.json()

    if (apiError) {
      setError(apiError)
      setLoading(false)
      return
    }

    const { paymentIntent, error: confirmError } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: { return_url: `${window.location.origin}/checkout/success` },
      redirect: 'if_required',
    })

    if (confirmError) {
      setError(confirmError.message ?? 'Error al confirmar el pago')
    } else if (paymentIntent?.status === 'succeeded') {
      onSuccess(paymentIntent.id)
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement options={{ layout: 'tabs' }} />
      {error && (
        <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-sm px-3 py-2">
          {error}
        </p>
      )}
      <Button type="submit" loading={loading} className="w-full">
        Pagar ${total().toFixed(2)} con tarjeta
      </Button>
    </form>
  )
}
