'use client'

import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js'
import { useCartStore } from '@/store/cart'

interface PayPalButtonProps {
  onSuccess: (captureId: string) => void
  onError: (err: string) => void
}

export function PayPalButton({ onSuccess, onError }: PayPalButtonProps) {
  const [{ isPending }] = usePayPalScriptReducer()
  const { total } = useCartStore()

  if (isPending) {
    return (
      <div className="h-12 bg-surface-floating rounded-sm animate-pulse" />
    )
  }

  return (
    <PayPalButtons
      style={{ layout: 'horizontal', color: 'gold', shape: 'rect', label: 'pay', height: 48 }}
      createOrder={async () => {
        const res = await fetch('/api/paypal/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: total() }),
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
          onSuccess(capture.captureID)
        } else {
          onError('El pago no se completó')
        }
      }}
      onError={() => onError('Error al procesar el pago con PayPal')}
    />
  )
}
