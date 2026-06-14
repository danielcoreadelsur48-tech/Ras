export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/db'
import { HeroBanner } from '@/components/home/HeroBanner'
import { CategorySection } from '@/components/home/CategorySection'
import { FeaturedProducts } from '@/components/home/FeaturedProducts'
import { PromoBanner } from '@/components/home/PromoBanner'
import { SponsorsCarousel } from '@/components/home/SponsorsCarousel'
import { FlayersSection } from '@/components/home/FlayersSection'
import type { ProductWithCategory, Sponsor, Flayer } from '@/types'

export const revalidate = 60

export default async function HomePage() {
  const [banners, categories, featured, recent, sponsors, flayers] = await Promise.all([
    prisma.banner.findMany({ where: { active: true }, orderBy: { position: 'asc' } }),
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
    prisma.product.findMany({
      where: { visible: true, featured: true },
      include: { category: true },
      take: 8,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.product.findMany({
      where: { visible: true, featured: false, memberOnly: false },
      include: { category: true },
      take: 8,
      orderBy: { createdAt: 'desc' },
    }),
    (prisma as any).sponsor.findMany({ where: { active: true }, orderBy: { position: 'asc' } }),
    (prisma as any).flayer.findMany({ where: { active: true }, orderBy: { position: 'asc' }, take: 4 }),
  ])

  return (
    <>
      <HeroBanner banners={banners} />
      <FlayersSection flayers={flayers as Flayer[]} />
      <SponsorsCarousel sponsors={sponsors as Sponsor[]} />
      <CategorySection categories={categories} />
      <FeaturedProducts products={featured as ProductWithCategory[]} title="Destacados" />
      <PromoBanner />
      <FeaturedProducts products={recent as ProductWithCategory[]} title="Nuevos en la tienda" />
    </>
  )
}
