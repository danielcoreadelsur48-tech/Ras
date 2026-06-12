'use client'

import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js'
import { useSession } from 'next-auth/react'

interface Props {
  amount: number
  onSuccess: () => void
  onError: (err: string) => void
}

export function PayPalVipButton({ amount, onSuccess, onError }: Props) {
  const [{ isPending }] = usePayPalScriptReducer()
  const { update } = useSession()

  if (isPending) {
    return <div className="h-12 bg-surface-floating rounded-sm animate-pulse" />
  }

  return (
    <PayPalButtons
      style={{ layout: 'horizontal', color: 'gold', shape: 'rect', label: 'pay', height: 48 }}
      createOrder={async () => {
        const res = await fetch('/api/paypal/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount }),
        })
        const data = await res.json()
        if (!data.orderID) throw new Error('Error al crear orden PayPal')
        return data.orderID
      }}
      onApprove={async (data) => {
        const res = await fetch('/api/paypal/capture-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderID: data.orderID }),
        })
        const capture = await res.json()
        if (capture.status === 'COMPLETED') {
          await fetch('/api/membership/upgrade', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ paymentId: capture.captureID, paymentMethod: 'paypal' }),
          })
          await update()
          onSuccess()
        } else {
          onError('El pago no se completó')
        }
      }}
      onError={() => onError('Error al procesar el pago con PayPal')}
    />
  )
}
