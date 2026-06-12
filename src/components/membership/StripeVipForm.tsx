'use client'

import { useState } from 'react'
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/Button'

interface Props {
  amount: number
  onSuccess: () => void
}

export function StripeVipForm({ amount, onSuccess }: Props) {
  const stripe = useStripe()
  const elements = useElements()
  const { update } = useSession()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

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
      body: JSON.stringify({ amount }),
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
      confirmParams: { return_url: `${window.location.origin}/membership` },
      redirect: 'if_required',
    })

    if (confirmError) {
      setError(confirmError.message ?? 'Error al confirmar el pago')
      setLoading(false)
      return
    }

    if (paymentIntent?.status === 'succeeded') {
      await fetch('/api/membership/upgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId: paymentIntent.id, paymentMethod: 'stripe' }),
      })
      await update()
      onSuccess()
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement
        options={{
          layout: 'tabs',
          appearance: {
            theme: 'night',
            variables: {
              colorPrimary: '#c9a227',
              colorBackground: '#1a1a1a',
              colorText: '#ffffff',
              borderRadius: '2px',
            },
          },
        } as any}
      />
      {error && (
        <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-sm px-3 py-2">
          {error}
        </p>
      )}
      <Button type="submit" loading={loading} className="w-full">
        Pagar ${amount.toFixed(2)} con tarjeta
      </Button>
    </form>
  )
}
