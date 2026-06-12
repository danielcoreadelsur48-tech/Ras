# Ras Store — rasstore007.com

Plataforma e-commerce para arte, cultura y servicios creativos. Incluye tienda online estilo Amazon, club de membresía, pasarela de pagos (Stripe + PayPal) y panel de administración.

---

## Stack

- **Next.js 14** (App Router) + TypeScript
- **Tailwind CSS** — tema oscuro personalizado
- **Prisma** + SQLite (desarrollo) / PostgreSQL (producción)
- **NextAuth.js** — autenticación con roles (MEMBER / ADMIN)
- **Stripe Elements** — pagos con tarjeta de crédito
- **PayPal JS SDK v2** — pagos con PayPal
- **Zustand** — estado del carrito con persistencia

---

## Instalación y configuración

### 1. Requisitos previos

- Node.js 18 o superior
- npm 9 o superior

### 2. Clonar e instalar dependencias

```bash
cd c:\Users\Daniel\Documents\ras
npm install
```

### 3. Configurar variables de entorno

Copia `.env.example` a `.env` y completa los valores:

```bash
copy .env.example .env
```

**Variables críticas para el primer arranque (mínimo):**

```env
# Genera un secret seguro:
# node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
NEXTAUTH_SECRET=tu-secret-aqui
NEXTAUTH_URL=http://localhost:3000

# Stripe — https://dashboard.stripe.com/apikeys (modo Test)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# PayPal — https://developer.paypal.com/dashboard/applications
NEXT_PUBLIC_PAYPAL_CLIENT_ID=...
PAYPAL_CLIENT_SECRET=...

# Email (opcional para desarrollo — sin esto el email no se envía pero todo lo demás funciona)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu@gmail.com
SMTP_PASS=tu-app-password
SMTP_FROM=Ras Store <tu@gmail.com>

# DB SQLite — no requiere cambios para desarrollo
DATABASE_URL="file:./dev.db"
```

### 4. Crear la base de datos

```bash
npm run db:push
```

### 5. Cargar datos de demo

```bash
npm run db:seed
```

Esto crea:
- **6 categorías**: Arte Visual, Arte Digital, Impresiones, Servicios Creativos, Producción, Logística
- **8 productos** de ejemplo (algunos solo para miembros)
- **2 banners** para el carousel del home
- **Admin demo**: `admin@rasstore007.com` / `admin123`
- **Miembro demo**: `miembro@rasstore007.com` / `member123`

### 6. Arrancar el servidor de desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## Acceso al panel de administración

1. Ve a `/login`
2. Ingresa con `admin@rasstore007.com` / `admin123`
3. Navega a `/admin`

Desde el panel puedes:
- **Productos**: crear, editar, eliminar. Configurar visibilidad y acceso (público / solo miembros).
- **Miembros**: ver usuarios registrados, cambiar rol (MEMBER / ADMIN), activar/desactivar cuentas.
- **Banners**: gestionar el carousel del hero en la página principal.

---

## Configurar pagos en modo Test

### Stripe
1. Crea una cuenta en [stripe.com](https://stripe.com)
2. Ve a Developers → API keys → copia las claves de **Test mode**
3. Pégalas en `.env`
4. Para probar: usa la tarjeta `4242 4242 4242 4242` con cualquier fecha futura y CVV

### PayPal
1. Crea una cuenta de desarrollador en [developer.paypal.com](https://developer.paypal.com)
2. Ve a Apps & Credentials → crea una app en **Sandbox**
3. Copia el Client ID y el Secret
4. Pégalos en `.env`
5. Para probar: usa las cuentas sandbox que PayPal crea automáticamente

### Webhooks (para confirmar pedidos)

En desarrollo, usa [Stripe CLI](https://stripe.com/docs/stripe-cli):

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

El CLI imprime un `whsec_...` — úsalo en `STRIPE_WEBHOOK_SECRET`.

---

## Scripts disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run start        # Servidor de producción (requiere npm run build primero)
npm run db:push      # Crea/actualiza la base de datos con el schema actual
npm run db:seed      # Carga datos de demo
npm run db:studio    # Abre Prisma Studio (GUI para ver/editar la DB)
npm run db:reset     # Borra y recrea la DB con datos demo
```

---

## Migrar a producción

### Base de datos (PostgreSQL)

1. Crea una base de datos PostgreSQL en [Supabase](https://supabase.com) o [Railway](https://railway.app)
2. En `prisma/schema.prisma`, cambia:
   ```prisma
   datasource db {
     provider = "postgresql"   // era "sqlite"
     url      = env("DATABASE_URL")
   }
   ```
3. Actualiza `DATABASE_URL` con la connection string de PostgreSQL
4. Ejecuta `npm run db:push` para crear las tablas en producción

### Deploy en Vercel

```bash
npx vercel --prod
```

Configura todas las variables de entorno en el dashboard de Vercel.
Recuerda cambiar `NEXTAUTH_URL` al dominio real: `https://rasstore007.com`.

### Stripe en producción

- Usa las claves **Live** (no Test) de Stripe
- Crea un webhook en el dashboard de Stripe apuntando a `https://rasstore007.com/api/stripe/webhook`
- Actualiza `STRIPE_WEBHOOK_SECRET` con el nuevo secret

---

## Estructura de archivos

```
ras/
├── prisma/
│   ├── schema.prisma    # Modelos: User, Product, Category, Order, OrderItem, Banner
│   └── seed.ts          # Datos de demo
├── src/
│   ├── app/             # Next.js App Router (páginas + API routes)
│   ├── components/      # Componentes React reutilizables
│   ├── lib/             # db.ts, auth.ts, stripe.ts, email.ts
│   ├── store/           # cart.ts (Zustand)
│   ├── types/           # Tipos TypeScript
│   └── middleware.ts    # Protección de rutas /admin y /checkout
├── .env                 # Variables de entorno (NO subir a git)
├── .env.example         # Template de variables (subir a git)
├── CLAUDE.md            # Documentación técnica del proyecto
└── README.md            # Este archivo
```

---

## Cuentas de demo (solo desarrollo)

| Email | Contraseña | Rol |
|---|---|---|
| admin@rasstore007.com | admin123 | ADMIN |
| miembro@rasstore007.com | member123 | MEMBER |

**Elimina o cambia estas cuentas antes de ir a producción.**
