import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { prisma } from '@/lib/db'

export const metadata: Metadata = {
  title: 'Ras Store — Arte, Cultura y Servicios Creativos',
  description:
    'Tienda online de arte, impresiones, diseño gráfico, producción audiovisual y servicios creativos. Directorio digital y cultural.',
  keywords: ['arte', 'pintura', 'escultura', 'diseño gráfico', 'impresiones', 'cultura'],
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } })

  return (
    <html lang="es">
      <body suppressHydrationWarning>
        <Providers>
          <Header categories={categories} />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
