import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Categorías
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'arte-visual' },
      update: { image: 'https://placehold.co/400x300/1a1a1a/c9a227.png?text=Arte+Visual' },
      create: {
        name: 'Arte Visual',
        slug: 'arte-visual',
        image: 'https://placehold.co/400x300/1a1a1a/c9a227.png?text=Arte+Visual',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'arte-digital' },
      update: { image: 'https://placehold.co/400x300/1a1a1a/c9a227.png?text=Arte+Digital' },
      create: {
        name: 'Arte Digital',
        slug: 'arte-digital',
        image: 'https://placehold.co/400x300/1a1a1a/c9a227.png?text=Arte+Digital',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'servicios-creativos' },
      update: { image: 'https://placehold.co/400x300/1a1a1a/c9a227.png?text=Servicios' },
      create: {
        name: 'Servicios Creativos',
        slug: 'servicios-creativos',
        image: 'https://placehold.co/400x300/1a1a1a/c9a227.png?text=Servicios',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'impresiones' },
      update: { image: 'https://placehold.co/400x300/1a1a1a/c9a227.png?text=Impresiones' },
      create: {
        name: 'Impresiones',
        slug: 'impresiones',
        image: 'https://placehold.co/400x300/1a1a1a/c9a227.png?text=Impresiones',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'produccion' },
      update: { image: 'https://placehold.co/400x300/1a1a1a/c9a227.png?text=Producción' },
      create: {
        name: 'Producción',
        slug: 'produccion',
        image: 'https://placehold.co/400x300/1a1a1a/c9a227.png?text=Producción',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'logistica' },
      update: { image: 'https://placehold.co/400x300/1a1a1a/c9a227.png?text=Logística' },
      create: {
        name: 'Logística',
        slug: 'logistica',
        image: 'https://placehold.co/400x300/1a1a1a/c9a227.png?text=Logística',
      },
    }),
  ])

  const [artVisual, artDigital, servicios, impresiones, produccion] = categories

  // Productos demo
  await Promise.all([
    prisma.product.upsert({
      where: { id: 'prod_001' },
      update: { images: JSON.stringify(['https://placehold.co/600x600/1a1a1a/c9a227.png?text=Cuadro+01']) },
      create: {
        id: 'prod_001',
        name: 'Cuadro Original — Abstracción Urbana',
        description: 'Pintura acrílica sobre lienzo 60x80cm. Técnica mixta con texturas. Firmado y certificado por el artista.',
        price: 450,
        images: JSON.stringify(['https://placehold.co/600x600/1a1a1a/c9a227.png?text=Cuadro+01']),
        categoryId: artVisual.id,
        stock: 1,
        featured: true,
        visible: true,
      },
    }),
    prisma.product.upsert({
      where: { id: 'prod_002' },
      update: { images: JSON.stringify(['https://placehold.co/600x600/242424/c9a227.png?text=Escultura+02']) },
      create: {
        id: 'prod_002',
        name: 'Escultura — Forma y Espacio',
        description: 'Escultura en arcilla terracota, acabado natural. Pieza única, 30cm de altura. Incluye base de madera.',
        price: 280,
        images: JSON.stringify(['https://placehold.co/600x600/242424/c9a227.png?text=Escultura+02']),
        categoryId: artVisual.id,
        stock: 1,
        featured: true,
        visible: true,
      },
    }),
    prisma.product.upsert({
      where: { id: 'prod_003' },
      update: { images: JSON.stringify(['https://placehold.co/600x600/111111/e8c547.png?text=Print+03']) },
      create: {
        id: 'prod_003',
        name: 'Print Digital — Serie Cosmos',
        description: 'Impresión de alta calidad en papel fine art 300g. Edición limitada 1/50. Disponible en 40x50cm.',
        price: 85,
        images: JSON.stringify(['https://placehold.co/600x600/111111/e8c547.png?text=Print+03']),
        categoryId: artDigital.id,
        stock: 50,
        featured: true,
        visible: true,
      },
    }),
    prisma.product.upsert({
      where: { id: 'prod_004' },
      update: { images: JSON.stringify(['https://placehold.co/600x600/1a1a1a/c9a227.png?text=Stickers+04']) },
      create: {
        id: 'prod_004',
        name: 'Pack Stickers — Colección Urbana',
        description: 'Pack de 20 stickers de vinilo resistente al agua. Diseños exclusivos de artistas locales.',
        price: 18,
        images: JSON.stringify(['https://placehold.co/600x600/1a1a1a/c9a227.png?text=Stickers+04']),
        categoryId: impresiones.id,
        stock: 200,
        visible: true,
      },
    }),
    prisma.product.upsert({
      where: { id: 'prod_005' },
      update: { images: JSON.stringify(['https://placehold.co/600x600/242424/c9a227.png?text=Diseño+05']) },
      create: {
        id: 'prod_005',
        name: 'Diseño Gráfico — Identidad Visual',
        description: 'Servicio completo de branding: logo, paleta, tipografía, manual de marca. Entrega en 7 días hábiles.',
        price: 320,
        images: JSON.stringify(['https://placehold.co/600x600/242424/c9a227.png?text=Diseño+05']),
        categoryId: servicios.id,
        stock: 99,
        visible: true,
      },
    }),
    prisma.product.upsert({
      where: { id: 'prod_006' },
      update: { images: JSON.stringify(['https://placehold.co/600x600/1a1a1a/e8c547.png?text=Video+06']) },
      create: {
        id: 'prod_006',
        name: 'Producción Audiovisual — Spot Publicitario',
        description: 'Producción de spot 30 segundos: guión, filmación, edición y color. Incluye 3 versiones.',
        price: 1200,
        images: JSON.stringify(['https://placehold.co/600x600/1a1a1a/e8c547.png?text=Video+06']),
        categoryId: produccion.id,
        stock: 10,
        memberOnly: true,
        visible: true,
        featured: true,
      },
    }),
    prisma.product.upsert({
      where: { id: 'prod_007' },
      update: { images: JSON.stringify(['https://placehold.co/600x600/242424/c9a227.png?text=Acrílico+07']) },
      create: {
        id: 'prod_007',
        name: 'Acrílico Decorativo — Personalizado',
        description: 'Panel de acrílico con impresión UV directa. Tu foto o diseño en acabado brillante. 40x60cm.',
        price: 95,
        images: JSON.stringify(['https://placehold.co/600x600/242424/c9a227.png?text=Acrílico+07']),
        categoryId: impresiones.id,
        stock: 30,
        visible: true,
      },
    }),
    prisma.product.upsert({
      where: { id: 'prod_008' },
      update: { images: JSON.stringify(['https://placehold.co/600x600/0a0a0a/c9a227.png?text=NFT+08']) },
      create: {
        id: 'prod_008',
        name: 'NFT Artwork — Colección Genesis',
        description: 'Arte digital certificado como NFT. Acceso exclusivo a galería virtual y comunidad de coleccionistas.',
        price: 650,
        images: JSON.stringify(['https://placehold.co/600x600/0a0a0a/c9a227.png?text=NFT+08']),
        categoryId: artDigital.id,
        stock: 5,
        memberOnly: true,
        featured: true,
        visible: true,
      },
    }),
  ])

  // Banners
  await Promise.all([
    prisma.banner.upsert({
      where: { id: 'banner_001' },
      update: { image: 'https://placehold.co/1400x500/0a0a0a/c9a227.png?text=Ras+Store+—+Arte+que+Inspira' },
      create: {
        id: 'banner_001',
        title: 'Arte que Inspira',
        subtitle: 'Descubre piezas únicas de artistas latinoamericanos',
        image: 'https://placehold.co/1400x500/0a0a0a/c9a227.png?text=Ras+Store+—+Arte+que+Inspira',
        link: '/products',
        active: true,
        position: 0,
      },
    }),
    prisma.banner.upsert({
      where: { id: 'banner_002' },
      update: { image: 'https://placehold.co/1400x500/111111/e8c547.png?text=Servicios+Creativos+Profesionales' },
      create: {
        id: 'banner_002',
        title: 'Servicios Creativos',
        subtitle: 'Diseño, producción audiovisual y más',
        image: 'https://placehold.co/1400x500/111111/e8c547.png?text=Servicios+Creativos+Profesionales',
        link: '/products?categoria=servicios-creativos',
        active: true,
        position: 1,
      },
    }),
  ])

  // Usuario admin demo
  const adminPassword = await bcrypt.hash('admin123', 12)
  await prisma.user.upsert({
    where: { email: 'admin@rasstore007.com' },
    update: {},
    create: {
      email: 'admin@rasstore007.com',
      password: adminPassword,
      name: 'Administrador',
      role: 'ADMIN',
      active: true,
    },
  })

  // Usuario miembro demo
  const memberPassword = await bcrypt.hash('member123', 12)
  await prisma.user.upsert({
    where: { email: 'miembro@rasstore007.com' },
    update: {},
    create: {
      email: 'miembro@rasstore007.com',
      password: memberPassword,
      name: 'Miembro Demo',
      role: 'MEMBER',
      active: true,
    },
  })

  console.log('✅ Seed completado: categorías, productos, banners y usuarios demo creados.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
