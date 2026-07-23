# Deployment Guide
## ProDesign Mauritius Training Academy

---

## Prerequisites

- Node.js 20+ 
- npm or pnpm
- [Supabase](https://supabase.com) account (PostgreSQL)
- [Vercel](https://vercel.com) account
- [Resend](https://resend.com) account (email)
- MIPS merchant account (for live payments)

---

## 1. Local Development Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd prodesign-academy

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Edit .env.local with your values
```

### Configure Environment Variables

Edit `.env.local`:

```env
DATABASE_URL="postgresql://..."      # Supabase connection pooler URL
DIRECT_URL="postgresql://..."        # Supabase direct connection URL
NEXTAUTH_SECRET="your-secret"        # openssl rand -base64 32
RESEND_API_KEY="re_..."              # From Resend dashboard
PAYMENT_PROVIDER="mock"              # Use "mock" for development
```

### Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed initial data (admin user + Revit course)
npx tsx prisma/seed.ts
```

**Default admin credentials:**
- Email: `admin@prodesign.mu`
- Password: `admin123`

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 2. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **Settings → Database**
3. Copy the **Connection string (URI)** for both:
   - **Transaction pooler** → `DATABASE_URL`
   - **Direct connection** → `DIRECT_URL`
4. Replace `[YOUR-PASSWORD]` with your database password

---

## 3. Vercel Deployment

### Option A: Git Integration (Recommended)

1. Push code to GitHub/GitLab
2. Import project in [Vercel Dashboard](https://vercel.com/new)
3. Configure environment variables (see below)
4. Deploy

### Option B: CLI

```bash
npm i -g vercel
vercel
```

### Vercel Environment Variables

Set these in Vercel Dashboard → Settings → Environment Variables:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | Supabase pooler URL |
| `DIRECT_URL` | Supabase direct URL |
| `NEXTAUTH_URL` | `https://training.prodesign.mu` |
| `NEXTAUTH_SECRET` | Random secure string |
| `RESEND_API_KEY` | Resend API key |
| `EMAIL_FROM` | `training@prodesign.mu` |
| `PAYMENT_PROVIDER` | `mips` (production) |
| `MIPS_MERCHANT_ID` | Your MIPS merchant ID |
| `MIPS_API_KEY` | Your MIPS API key |
| `MIPS_WEBHOOK_SECRET` | MIPS webhook secret |
| `NEXT_PUBLIC_APP_URL` | `https://training.prodesign.mu` |
| `NEXT_PUBLIC_MAIN_SITE_URL` | `https://prodesign.mu` |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Your WhatsApp number |

### Build Settings

Vercel auto-detects Next.js. Ensure:
- **Framework Preset:** Next.js
- **Build Command:** `prisma generate && next build`
- **Install Command:** `npm install`

Add to `package.json` scripts if needed:
```json
{
  "scripts": {
    "postinstall": "prisma generate"
  }
}
```

---

## 4. Domain Configuration

### Training Portal (v1)
- Deploy to Vercel
- Add custom domain: `training.prodesign.mu`
- Configure DNS CNAME record pointing to Vercel

### Future: Academy Subdomain
- When ready, add `academy.prodesign.mu` as additional domain
- Update `NEXT_PUBLIC_APP_URL` accordingly

### Main Website Integration
- Ensure `prodesign.mu` links to training portal
- Training portal links back via `NEXT_PUBLIC_MAIN_SITE_URL`

---

## 5. Email Setup (Resend)

1. Create account at [resend.com](https://resend.com)
2. Add and verify domain `prodesign.mu`
3. Create API key
4. Set `RESEND_API_KEY` and `EMAIL_FROM=training@prodesign.mu`

---

## 6. Payment Setup (MIPS)

For production payments:

1. Register merchant account at [mips.mu](https://mips.mu)
2. Obtain API credentials
3. Set environment variables:
   ```env
   PAYMENT_PROVIDER=mips
   MIPS_MERCHANT_ID=your_merchant_id
   MIPS_API_KEY=your_api_key
   MIPS_WEBHOOK_SECRET=your_webhook_secret
   ```
4. Configure webhook URL: `https://training.prodesign.mu/api/payments/webhook`

For development, keep `PAYMENT_PROVIDER=mock` — payments auto-complete.

---

## 7. Post-Deployment Checklist

- [ ] Database seeded with admin user and course data
- [ ] Admin login works (`admin@prodesign.mu`)
- [ ] Registration flow creates user + enrollment
- [ ] Payment flow completes (mock or MIPS)
- [ ] Emails sending via Resend
- [ ] Student dashboard accessible after payment
- [ ] Admin dashboard shows analytics
- [ ] SEO: sitemap.xml and robots.txt accessible
- [ ] Dark/light mode working
- [ ] Mobile responsive on all pages
- [ ] Cross-links to prodesign.mu working
- [ ] WhatsApp button functional

---

## 8. Monitoring

- **Vercel Analytics:** Enable in Vercel dashboard
- **Error tracking:** Consider Sentry integration
- **Uptime:** Monitor via Vercel or external service

---

## 9. Scaling Considerations

| Stage | Action |
|-------|--------|
| Launch | Supabase free tier, Vercel Hobby |
| Growth | Supabase Pro, Vercel Pro |
| Multi-course | Add courses via admin dashboard |
| LMS features | Integrate video hosting (Mux) |
| Subdomain | Migrate to academy.prodesign.mu |

---

## Support

For technical issues, contact the development team or refer to:
- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Resend Docs](https://resend.com/docs)
