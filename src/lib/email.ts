import nodemailer from 'nodemailer'
import type { OrderWithItems } from '@/types'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function sendOrderConfirmation(order: OrderWithItems) {
  const itemsHtml = order.items
    .map(
      (item) =>
        `<tr>
          <td style="padding:8px;border-bottom:1px solid #333">${item.product.name}</td>
          <td style="padding:8px;border-bottom:1px solid #333;text-align:center">${item.quantity}</td>
          <td style="padding:8px;border-bottom:1px solid #333;text-align:right">$${(item.price * item.quantity).toFixed(2)}</td>
        </tr>`
    )
    .join('')

  const html = `
    <!DOCTYPE html>
    <html>
    <body style="background:#0a0a0a;color:#fff;font-family:sans-serif;margin:0;padding:40px 20px">
      <div style="max-width:600px;margin:0 auto">
        <h1 style="color:#6ed1fd;font-size:28px;margin-bottom:8px">Ras Store</h1>
        <p style="color:#aaa;margin-bottom:32px">rasstore007.com</p>

        <h2 style="font-size:20px;margin-bottom:16px">¡Gracias por tu compra, ${order.user.name || order.email}!</h2>
        <p style="color:#ccc">Tu pedido <strong style="color:#6ed1fd">#${order.id.slice(-8).toUpperCase()}</strong> ha sido confirmado.</p>

        <table style="width:100%;border-collapse:collapse;margin:24px 0">
          <thead>
            <tr style="background:#1a1a1a">
              <th style="padding:8px;text-align:left">Producto</th>
              <th style="padding:8px;text-align:center">Cant.</th>
              <th style="padding:8px;text-align:right">Subtotal</th>
            </tr>
          </thead>
          <tbody>${itemsHtml}</tbody>
        </table>

        <p style="text-align:right;font-size:18px">
          <strong>Total: <span style="color:#6ed1fd">$${order.total.toFixed(2)}</span></strong>
        </p>

        <p style="color:#666;margin-top:40px;font-size:12px">
          Ras Store · rasstore007.com · Todos los derechos reservados
        </p>
      </div>
    </body>
    </html>
  `

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: order.email,
    subject: `Confirmación de pedido #${order.id.slice(-8).toUpperCase()} — Ras Store`,
    html,
  })
}
