# ProDesign Mauritius Training Academy

Premium Autodesk training platform for ProDesign Mauritius — convert visitors into paid students for BIM certification programs.

**Live target:** `training.prodesign.mu` → future `academy.prodesign.mu`

---

## Features

- **Conversion-focused homepage** with hero, stats, countdown, testimonials, and CTAs
- **Course catalog** with detailed Revit Foundation course page
- **Multi-step registration** with validation and email confirmation
- **Stripe-like checkout** with MIPS-ready payment integration
- **Student dashboard** for enrollment, payments, invoices, and profile
- **Admin dashboard** for students, courses, payments, and analytics
- **Email automation** via Resend (registration, payment, enrollment, reminders)
- **SEO optimized** with metadata, JSON-LD, sitemap, and robots.txt
- **Dark/Light mode** with premium animations (Framer Motion)
- **Cross-site integration** with main website at [prodesign.mu](https://prodesign.mu)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15+ (App Router) |
| Language | TypeScript |
| Styling | TailwindCSS + ShadCN UI |
| Animation | Framer Motion |
| Database | PostgreSQL (Supabase) |
| ORM | Prisma |
| Auth | NextAuth.js v5 |
| Email | Resend |
| Payments | MIPS-ready layer |


---

## Quick Start

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your values

# Setup database
npm run db:push
npm run db:seed

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

**Admin login:** `admin@prodesign.mu` / `admin123`

---

## Project Structure

```
docs/           Planning documents (PRD, ERD, Architecture, etc.)
prisma/         Database schema and seed data
public/         Static assets
src/
├── app/        Next.js App Router pages and API routes
├── components/ UI components (ui, layout, home, course, forms, etc.)
├── lib/        Utilities, auth, email, payments, validations
├── hooks/      Custom React hooks
└── types/      TypeScript type definitions
```

---

## Documentation

| Document | Description |
|----------|-------------|
| [PRD](docs/PRD.md) | Product Requirements Document |
| [Sitemap](docs/SITEMAP.md) | Site structure and navigation |
| [ERD](docs/ERD.md) | Database entity relationships |
| [User Flows](docs/USER-FLOWS.md) | Conversion and user journeys |
| [Wireframes](docs/WIREFRAMES.md) | Page layout wireframes |
| [Architecture](docs/ARCHITECTURE.md) | Technical architecture |
| [Deployment](docs/DEPLOYMENT.md) | Deployment guide for Vercel + Supabase |

---

## Key Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage with conversion funnel |
| `/courses/revit-foundation` | Revit Foundation course details |
| `/register` | Multi-step registration form |
| `/checkout` | Payment checkout |
| `/dashboard` | Student dashboard |
| `/admin` | Admin dashboard |
| `/login` | Authentication |

---

## Environment Variables

See [.env.example](.env.example) for all required variables.

---

## Deployment

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for complete Vercel + Supabase deployment instructions.

---

## License

Proprietary — ProDesign Mauritius © 2026
