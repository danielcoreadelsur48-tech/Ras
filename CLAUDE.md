# Rasstore007 — Project Technical Documentation

## General Description

Rasstore007.com is an online store, digital and cultural directory, and logistics services provider. It sells art products and creative services through an Amazon-style storefront with a membership club that gates access to exclusive content and pricing.

**Core functions:**
1. **Online Store** — art products and creative services (physical and digital)
2. **Digital & Cultural Directory** — curated listing of artists, organizations, and cultural services
3. **Logistics Services Provider** — fulfillment and distribution for creative businesses

---

## Purpose & Target Audience

| Audience | Need |
|---|---|
| Artists & creators | Sell originals, prints, digital art, and services |
| Collectors & buyers | Discover and purchase art online |
| Cultural organizations | List events, services, and resources in the directory |
| Businesses | Source design, advertising, audiovisual, and logistics services |
| Members | Access exclusive content and products by subscription tier |

---

## Product & Service Catalog

**Visual Art**
- Original paintings, sculptures, digital art, prints, stickers, acrylics

**Creative Services**
- Graphic design, advertising, branding, image & concept development

**Production**
- Audiovisual production, editorial design

**Raw Materials & Supplies**
- Art supplies, sporting goods

**Logistics**
- Distribution, fulfillment, and delivery services for creative businesses

---

## Core System Modules

| # | Module | Description |
|---|---|---|
| 1 | **Storefront** | Amazon-style home: HeroBanner → Flayers → Sponsors → Categories → Featured → PromoBanner → Recent |
| 2 | **Cart & Checkout** | Multi-step checkout with address, shipping method, and payment selection |
| 3 | **Payment Gateway** | PayPal + credit/debit card with universal bank compatibility |
| 4 | **Membership Club** | VIP tier (`/products/prod_006`) gates access to exclusive products and pricing |
| 5 | **Flayers** | Up to 4 large poster images with glow animation, managed in admin. Positioned between HeroBanner and Sponsors |
| 6 | **Cultural Directory** | Searchable, categorized listing of artists, orgs, events, and services |
| 7 | **Logistics Module** | Service request flow for distribution and fulfillment |
| 8 | **Admin Panel** | Inventory, order management, member management, banners, flayers, sponsors |
| 9 | **Legal Pages** | `/privacidad` (Privacy Policy) and `/terminos` (Terms & Conditions) — linked from footer |
| 10 | **User Accounts** | Profile, order history, membership status, saved addresses |

---

## Actual Stack (implemented)

```
Framework:    Next.js 14 (App Router) + TypeScript
Styles:       Tailwind CSS (custom dark theme — two accents, see Color System below)
Database:     SQLite via Prisma (dev) → swap provider to PostgreSQL for production
Auth:         NextAuth.js v4 — credentials provider, JWT, roles: MEMBER | VIP | ADMIN
Cart state:   Zustand + localStorage (persistent across sessions)
Payments:     Stripe Elements (cards) + PayPal JS SDK v2 (PayPal)
Email:        Nodemailer + SMTP (order confirmation)
Hosting:      Vercel (recommended) + Supabase/Railway for production DB
```

**Why SQLite for dev:** Zero setup on any OS. `prisma db push` creates the DB in seconds.
To migrate to PostgreSQL for production: change `provider = "sqlite"` to `"postgresql"` in
`prisma/schema.prisma` and update `DATABASE_URL`.

## Color System

Dos acentos — no mezclarlos:

| Token | Hex | Uso |
|---|---|---|
| `gold` / `#c9a227` | Dorado | **Solo VIP y membresía** — badges VIP, PromoBanner del club, animación glow del botón "Obtén el VIP", animación glow de los Flayers, logo "RAS" en sidebar admin |
| `accent` / `#6ed1fd` | Azul celeste | **Todo lo demás** — botones primarios, inputs focus, carrito, links activos, navegación, textos "ALIADOS" y "Sponsors" en el carousel |

Regla: si el elemento es de VIP/membresía → `gold`. Si es UI general → `accent`.

## Project Directory Structure

```
ras/
├── prisma/
│   ├── schema.prisma          # DB schema: User, Product, Order, Category, Banner, Sponsor, Flayer
│   └── seed.ts                # Demo data: 6 categories, 8 products, 2 banners, 2 users
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Root layout (Header + Footer + Providers)
│   │   ├── providers.tsx      # SessionProvider + PayPalScriptProvider
│   │   ├── page.tsx           # Home SSR: banners → flayers → sponsors → categories → featured → promo → recent
│   │   ├── products/          # Catalog + product detail (prod_006 = VIP membership)
│   │   ├── cart/              # Cart page
│   │   ├── checkout/          # Checkout + success pages
│   │   ├── login/             # Login page
│   │   ├── register/          # Register page
│   │   ├── privacidad/        # Política de privacidad
│   │   ├── terminos/          # Términos y condiciones
│   │   ├── admin/             # layout, dashboard, products, categories, members, banners, flayers, sponsors
│   │   └── api/               # auth, products, orders, stripe, paypal, upload, admin/(banners|flayers|sponsors|categories|users)
│   ├── components/
│   │   ├── layout/            # Header, Footer, CartDrawer
│   │   ├── home/              # HeroBanner, FlayersSection, SponsorsCarousel, CategorySection, FeaturedProducts, PromoBanner
│   │   ├── product/           # ProductCard
│   │   ├── checkout/          # StripeForm, PayPalButton
│   │   ├── admin/             # ProductForm, ImageUpload
│   │   └── ui/                # Button, Badge, Modal
│   ├── lib/                   # db.ts, auth.ts, stripe.ts, email.ts
│   ├── store/                 # cart.ts (Zustand)
│   ├── types/                 # index.ts — exporta Banner, Sponsor, Flayer, ProductWithCategory, etc.
│   └── middleware.ts          # Protects /admin/* and /checkout
└── CLAUDE.md
```

## Flayers — Detalles de implementación

- Modelo Prisma: `Flayer { id, image, link?, active, position }` — igual a Sponsor pero sin `name`
- Nuevos modelos se agregan con `(prisma as any).modelName` hasta que el cliente se regenere
- Para regenerar el cliente Prisma en Windows: detener todos los procesos `node`, luego `npx prisma generate`
- Animación de luz: `@keyframes` embebidos en `<style>` tag dentro del componente servidor (válido en Next.js App Router)
- El mismo patrón de glow se usa en `FlayersSection.tsx` y en el botón VIP de `PromoBanner.tsx`

---

## Payment Integrations

### PayPal
- SDK: PayPal JS SDK v2 (`@paypal/react-paypal-js`)
- Supports: PayPal balance, Pay Later, debit/credit cards via PayPal
- Integration point: client-side buttons + server-side order capture webhook

### Credit/Debit Card (Stripe)
- SDK: Stripe Elements (`@stripe/stripe-js` + `@stripe/react-stripe-js`)
- Supports: global bank compatibility, 3D Secure, international cards
- Integration point: Payment Intent API + webhook for order confirmation

Both gateways must implement **webhooks** to confirm payment before fulfilling orders or
activating memberships — never trust client-side confirmation alone.

---

## Architecture Recommendations

**Membership access control**
Implement as Next.js middleware that checks the session role before rendering gated routes.
Three tiers minimum: `free`, `member`, `premium`. Store tier in the JWT claim + DB.

**Directory as independent module**
The cultural directory has different data shape than the store. Keep it as a separate
Sanity dataset or DB schema — do not force-fit it into the product catalog model.

**Storefront home (Amazon-style)**
Build the home as a server component with `generateStaticParams` for category pages.
Use Algolia InstantSearch for the search bar — it gives real-time results without
hitting the DB on every keystroke.

**Image pipeline**
All product images → Cloudinary on upload. Use `next/image` with Cloudinary loader.
Never serve raw uploads — enforce size limits (max 10MB raw, auto-compressed for display).

**Logistics module**
Treat as a service request form → internal ticket system (can start with email notification,
migrate to a proper CRM later). Not an automated shipping integration initially.

---

## Required Environment Variables

```bash
# Payments
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=

# Database
DATABASE_URL=                  # PostgreSQL connection string
REDIS_URL=

# Auth
NEXTAUTH_SECRET=
NEXTAUTH_URL=

# Search
NEXT_PUBLIC_ALGOLIA_APP_ID=
NEXT_PUBLIC_ALGOLIA_SEARCH_KEY=
ALGOLIA_ADMIN_KEY=

# Media
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# CMS
SANITY_PROJECT_ID=
SANITY_DATASET=
SANITY_API_TOKEN=
```

---

# Agent Instructions

You're working inside the **WAT framework** (Workflows, Agents, Tools). This architecture separates concerns so that probabilistic AI handles reasoning while deterministic code handles execution. That separation is what makes this system reliable.

## The WAT Architecture

**Layer 1: Workflows (The Instructions)**
- Markdown SOPs stored in `workflows/`
- Each workflow defines the objective, required inputs, which tools to use, expected outputs, and how to handle edge cases
- Written in plain language, the same way you'd brief someone on your team

**Layer 2: Agents (The Decision-Maker)**
- This is your role. You're responsible for intelligent coordination.
- Read the relevant workflow, run tools in the correct sequence, handle failures gracefully, and ask clarifying questions when needed
- You connect intent to execution without trying to do everything yourself
- Example: If you need to pull data from a website, don't attempt it directly. Read `workflows/scrape_website.md`, figure out the required inputs, then execute `tools/scrape_single_site.py`

**Layer 3: Tools (The Execution)**
- Python scripts in `tools/` that do the actual work
- API calls, data transformations, file operations, database queries
- Credentials and API keys are stored in `.env`
- These scripts are consistent, testable, and fast

**Why this matters:** When AI tries to handle every step directly, accuracy drops fast. If each step is 90% accurate, you're down to 59% success after just five steps. By offloading execution to deterministic scripts, you stay focused on orchestration and decision-making where you excel.

## How to Operate

**1. Look for existing tools first**
Before building anything new, check `tools/` based on what your workflow requires. Only create new scripts when nothing exists for that task.

**2. Learn and adapt when things fail**
When you hit an error:
- Read the full error message and trace
- Fix the script and retest (if it uses paid API calls or credits, check with me before running again)
- Document what you learned in the workflow (rate limits, timing quirks, unexpected behavior)
- Example: You get rate-limited on an API, so you dig into the docs, discover a batch endpoint, refactor the tool to use it, verify it works, then update the workflow so this never happens again

**3. Keep workflows current**
Workflows should evolve as you learn. When you find better methods, discover constraints, or encounter recurring issues, update the workflow. That said, don't create or overwrite workflows without asking unless I explicitly tell you to. These are your instructions and need to be preserved and refined, not tossed after one use.

## The Self-Improvement Loop

Every failure is a chance to make the system stronger:
1. Identify what broke
2. Fix the tool
3. Verify the fix works
4. Update the workflow with the new approach
5. Move on with a more robust system

This loop is how the framework improves over time.

## File Structure

**What goes where:**
- **Deliverables**: Final outputs go to cloud services (Google Sheets, Slides, etc.) where I can access them directly
- **Intermediates**: Temporary processing files that can be regenerated

**Directory layout:**
```
.tmp/           # Temporary files (scraped data, intermediate exports). Regenerated as needed.
tools/          # Python scripts for deterministic execution
workflows/      # Markdown SOPs defining what to do and how
.env            # API keys and environment variables (NEVER store secrets anywhere else)
credentials.json, token.json  # Google OAuth (gitignored)
```

**Core principle:** Local files are just for processing. Anything I need to see or use lives in cloud services. Everything in `.tmp/` is disposable.

## Bottom Line

You sit between what I want (workflows) and what actually gets done (tools). Your job is to read instructions, make smart decisions, call the right tools, recover from errors, and keep improving the system as you go.

Stay pragmatic. Stay reliable. Keep learning.

---

# Website Development Best Practices

*I for Command, *L for Agent

---

## Website Design Recreation

When the user provides a reference image (screenshot) and optionally some CSS classes or style notes:

### Workflow

1. **Generate** a single `index.html` file using Tailwind CSS (via CDN). Include all content inline — no external files unless requested.
2. **Screenshot** the rendered page using Puppeteer (`npx puppeteer screenshot index.html --fullpage` or equivalent). If the page has distinct sections, capture those individually too.
3. **Compare** your screenshot against the reference image. Check for mismatches in:
   - Spacing and padding (measure in px)
   - Font sizes, weights, and line heights
   - Colors (exact hex values)
   - Alignment and positioning
   - Border radii, shadows, and effects
   - Responsive behavior
   - Image/icon sizing and placement
4. **Fix** every mismatch found. Edit the HTML/Tailwind code.
5. **Re-screenshot** and compare again.
6. **Repeat** steps 3–5 until the result is within ~2–3px of the reference everywhere.

Do NOT stop after one pass. Always do at least 2 comparison rounds. Only stop when the user says so or when no visible differences remain.

### Technical Defaults

- Use Tailwind CSS via CDN (`<script src="https://cdn.tailwindcss.com"></script>`)
- Use placeholder images from `https://placehold.co/` when source images aren't provided
- Mobile-first responsive design
- Single `index.html` file unless the user requests otherwise
- Use semantic HTML5 elements (`<header>`, `<main>`, `<section>`, `<footer>`, etc.)
- Include `<meta name="viewport" content="width=device-width, initial-scale=1.0">` always

---

## Website Creation from Scratch

When the user asks to build a new site, landing page, dashboard, or any web interface:

### Design Thinking (Before Coding)

Before writing any code, define:

- **Purpose**: What problem does this interface solve? Who uses it?
- **Tone**: Choose a BOLD aesthetic direction — brutally minimal, maximalist, retro-futuristic, organic/natural, luxury/refined, playful, editorial/magazine, brutalist/raw, art deco, soft/pastel, industrial, etc.
- **Constraints**: Framework, performance targets, accessibility needs.
- **Differentiation**: What makes this UNFORGETTABLE? What's the one thing someone will remember?

Choose a clear conceptual direction and execute it with precision. Bold maximalism and refined minimalism both work — the key is intentionality, not intensity.

### Frontend Aesthetics Guidelines

- **Typography**: Choose distinctive, characterful fonts. NEVER default to Inter, Roboto, Arial, or generic system fonts. Pair a display font with a refined body font. Use Google Fonts or CDN-hosted fonts.
- **Color & Theme**: Commit to a cohesive palette using CSS variables. Dominant colors with sharp accents > timid, evenly-distributed palettes. Vary between light/dark themes across projects.
- **Motion & Animation**: Prioritize CSS-only animations for HTML projects. Focus on high-impact moments: staggered page-load reveals (`animation-delay`), scroll-triggered effects, and hover states that surprise. One well-orchestrated animation > scattered micro-interactions.
- **Spatial Composition**: Use unexpected layouts. Asymmetry, overlap, diagonal flow, grid-breaking elements. Generous negative space OR controlled density — pick one and commit.
- **Backgrounds & Depth**: Create atmosphere — gradient meshes, noise textures, geometric patterns, layered transparencies, dramatic shadows, decorative borders, grain overlays. Never default to plain solid colors.

### What to AVOID (Generic AI Aesthetics)

- Overused font families (Inter, Roboto, Arial, Space Grotesk)
- Purple gradients on white backgrounds
- Predictable card-grid layouts
- Cookie-cutter component patterns
- Converging on the same design choices across different projects

---

## General Development Standards

### File Structure

```
project/
├── index.html          # Main entry point
├── assets/
│   ├── css/            # Custom CSS if needed beyond Tailwind
│   ├── js/             # JavaScript files
│   └── images/         # Local images
└── pages/              # Additional HTML pages if multi-page
```

### Code Quality

- Write semantic, accessible HTML (`alt` attributes, ARIA labels, proper heading hierarchy)
- Use CSS custom properties (`--var`) for colors, spacing, and typography tokens
- Keep JavaScript minimal and vanilla unless a framework is specified
- Inline critical CSS for performance when applicable
- Optimize images: use `loading="lazy"` and appropriate `srcset` for responsive images
- Ensure keyboard navigation works for all interactive elements

### Responsive Design Checklist

- Test at: 320px (mobile), 768px (tablet), 1024px (laptop), 1440px (desktop)
- Use Tailwind breakpoints: `sm:`, `md:`, `lg:`, `xl:`, `2xl:`
- Text should never overflow its container
- Touch targets minimum 44x44px on mobile
- Images and videos should be fluid (`max-width: 100%`)
- Navigation should collapse into hamburger/drawer on mobile

### Performance

- Minimize external dependencies — every CDN link adds latency
- Use system font stacks as fallback: `font-family: 'ChosenFont', system-ui, sans-serif`
- Defer non-critical JavaScript with `defer` or `async`
- Avoid layout shifts: set explicit `width` and `height` on images
- Keep total page weight under 1MB when possible

### Accessibility (a11y)

- Color contrast ratio: minimum 4.5:1 for normal text, 3:1 for large text
- All images must have descriptive `alt` text
- Focus states visible on all interactive elements
- Proper use of landmarks: `<nav>`, `<main>`, `<aside>`, `<footer>`
- Form inputs must have associated `<label>` elements
- Use `prefers-reduced-motion` media query for users who disable animations
- Use `prefers-color-scheme` for automatic dark/light mode when appropriate

---

## Screenshot & Visual QA Workflow

For any visual work, use this loop:

```bash
# Take a full-page screenshot
npx puppeteer screenshot index.html --fullpage

# Take a screenshot at specific viewport width
npx puppeteer screenshot index.html --viewport 375x812  # iPhone
npx puppeteer screenshot index.html --viewport 1440x900 # Desktop
```

### Comparison Checklist

When comparing screenshots against a reference or previous iteration:

1. **Layout**: Are sections, grids, and flex containers aligned correctly?
2. **Typography**: Font size, weight, line-height, letter-spacing match?
3. **Colors**: Background, text, border, shadow colors match exact hex/rgb?
4. **Spacing**: Margins, paddings, gaps between elements consistent?
5. **Components**: Buttons, cards, inputs, navbars match in shape and style?
6. **Images**: Correct aspect ratio, object-fit, border-radius?
7. **Responsive**: Does it hold up at mobile/tablet/desktop widths?
8. **Interactive states**: Hover, focus, active styles look correct?

---

## Useful CDN Resources

```html
<!-- Tailwind CSS -->
<script src="https://cdn.tailwindcss.com"></script>

<!-- Google Fonts (example) -->
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@400;500;700&display=swap" rel="stylesheet">

<!-- Lucide Icons -->
<script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>

<!-- Alpine.js (lightweight interactivity) -->
<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>

<!-- GSAP (advanced animations) -->
<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/ScrollTrigger.min.js"></script>

<!-- Placeholder images -->
<!-- https://placehold.co/600x400 -->
<!-- https://placehold.co/600x400/EEE/31343C -->
```

---

## Quick Reference Commands

```bash
# Start a local server
npx serve .

# Screenshot with Puppeteer
npx puppeteer screenshot index.html --fullpage

# Format HTML (if prettier is available)
npx prettier --write index.html

# Check accessibility
npx pa11y index.html
```

---

# CLAUDE.md — Frontend Website Rules

## Always Do First
- **Invoke the `frontend-design` skill** before writing any frontend code, every session, no exceptions.

## Reference Images
- If a reference image is provided: match layout, spacing, typography, and color exactly. Swap in placeholder content (images via `https://placehold.co/`, generic copy). Do not improve or add to the design.
- If no reference image: design from scratch with high craft (see guardrails below).
- Screenshot your output, compare against reference, fix mismatches, re-screenshot. Do at least 2 comparison rounds. Stop only when no visible differences remain or user says so.

## Local Server
- **Always serve on localhost** — never screenshot a `file:///` URL.
- Start the dev server: `node serve.mjs` (serves the project root at `http://localhost:3000`)
- `serve.mjs` lives in the project root. Start it in the background before taking any screenshots.
- If the server is already running, do not start a second instance.

## Screenshot Workflow
- Puppeteer is installed at `C:/Users/nateh/AppData/Local/Temp/puppeteer-test/`. Chrome cache is at `C:/Users/nateh/.cache/puppeteer/`.
- **Always screenshot from localhost:** `node screenshot.mjs http://localhost:3000`
- Screenshots are saved automatically to `./temporary screenshots/screenshot-N.png` (auto-incremented, never overwritten).
- Optional label suffix: `node screenshot.mjs http://localhost:3000 label` → saves as `screenshot-N-label.png`
- `screenshot.mjs` lives in the project root. Use it as-is.
- After screenshotting, read the PNG from `temporary screenshots/` with the Read tool — Claude can see and analyze the image directly.
- When comparing, be specific: "heading is 32px but reference shows ~24px", "card gap is 16px but should be 24px"
- Check: spacing/padding, font size/weight/line-height, colors (exact hex), alignment, border-radius, shadows, image sizing

## Output Defaults
- Single `index.html` file, all styles inline, unless user says otherwise
- Tailwind CSS via CDN: `<script src="https://cdn.tailwindcss.com"></script>`
- Placeholder images: `https://placehold.co/WIDTHxHEIGHT`
- Mobile-first responsive

## Brand Assets
- Always check the `brand_assets/` folder before designing. It may contain logos, color guides, style guides, or images.
- If assets exist there, use them. Do not use placeholders where real assets are available.
- If a logo is present, use it. If a color palette is defined, use those exact values — do not invent brand colors.

## Anti-Generic Guardrails
- **Colors:** Never use default Tailwind palette (indigo-500, blue-600, etc.). Pick a custom brand color and derive from it.
- **Shadows:** Never use flat `shadow-md`. Use layered, color-tinted shadows with low opacity.
- **Typography:** Never use the same font for headings and body. Pair a display/serif with a clean sans. Apply tight tracking (`-0.03em`) on large headings, generous line-height (`1.7`) on body.
- **Gradients:** Layer multiple radial gradients. Add grain/texture via SVG noise filter for depth.
- **Animations:** Only animate `transform` and `opacity`. Never `transition-all`. Use spring-style easing.
- **Interactive states:** Every clickable element needs hover, focus-visible, and active states. No exceptions.
- **Images:** Add a gradient overlay (`bg-gradient-to-t from-black/60`) and a color treatment layer with `mix-blend-multiply`.
- **Spacing:** Use intentional, consistent spacing tokens — not random Tailwind steps.
- **Depth:** Surfaces should have a layering system (base → elevated → floating), not all sit at the same z-plane.

## Hard Rules
- Do not add sections, features, or content not in the reference
- Do not "improve" a reference design — match it
- Do not stop after one screenshot pass
- Do not use `transition-all`
- Do not use default Tailwind blue/indigo as primary color
