# Sitemap
## ProDesign Mauritius Training Academy

```
prodesign.mu (Main Corporate Site)
│
├── /                           Corporate homepage
├── /services                   BIM Consulting, Architectural Technology
├── /about                      Company information
├── /contact                    Corporate contact
└── ...

training.prodesign.mu (Training Portal — v1 launch)
│  Future: academy.prodesign.mu
│
├── PUBLIC PAGES
│   ├── /                       Home
│   ├── /courses                Course catalog (all courses)
│   ├── /courses/[slug]         Individual course detail
│   │   └── /courses/revit-foundation   Launch course
│   ├── /about                  About Training at ProDesign
│   ├── /instructor             Instructor profile
│   ├── /faq                    Frequently Asked Questions
│   ├── /contact                Contact form
│   ├── /blog                   Blog listing
│   ├── /blog/[slug]            Blog post
│   ├── /register               Multi-step registration
│   ├── /register/success       Registration confirmation
│   ├── /checkout               Payment checkout
│   ├── /checkout/success       Payment success
│   ├── /checkout/failed        Payment failed
│   ├── /terms                  Terms & Conditions
│   ├── /privacy                Privacy Policy
│   └── /brochure               Download brochure (PDF redirect)
│
├── AUTHENTICATED — STUDENT
│   ├── /dashboard              Student overview
│   ├── /dashboard/enrollment   Enrollment status
│   ├── /dashboard/payments     Payment history
│   ├── /dashboard/invoices     Invoice downloads
│   ├── /dashboard/course       Course information
│   └── /dashboard/profile      Profile settings
│
├── AUTHENTICATED — ADMIN
│   ├── /admin                  Admin overview / analytics
│   ├── /admin/students         Student management
│   ├── /admin/students/[id]    Student detail/edit
│   ├── /admin/courses          Course management
│   ├── /admin/courses/[id]     Course edit
│   ├── /admin/payments         Payment transactions
│   └── /admin/analytics        Conversion & revenue analytics
│
├── API ROUTES
│   ├── /api/auth/[...nextauth] NextAuth handlers
│   ├── /api/register           POST registration
│   ├── /api/checkout           POST initiate payment
│   ├── /api/payments/webhook   MIPS/payment webhook
│   ├── /api/payments/[id]      GET payment status
│   ├── /api/invoices/[id]      GET/download invoice
│   ├── /api/contact            POST contact form
│   ├── /api/newsletter         POST newsletter signup
│   ├── /api/admin/students     CRUD students
│   ├── /api/admin/courses      CRUD courses
│   ├── /api/admin/payments     List/update payments
│   └── /api/admin/analytics    Analytics data
│
└── SEO / STATIC
    ├── /sitemap.xml            Dynamic sitemap
    ├── /robots.txt             Crawler rules
    └── /opengraph-image        OG image generation
```

---

## Navigation Structure

### Header (Training Portal)
| Item | Route | Notes |
|------|-------|-------|
| Home | `/` | Logo links here |
| Courses | `/courses` | Dropdown for future courses |
| About Training | `/about` | Training-specific about |
| Instructor | `/instructor` | Lead instructor profile |
| FAQ | `/faq` | Accordion FAQ page |
| Contact | `/contact` | Contact form |
| Register | `/register` | Primary CTA button |
| Main Website | `https://prodesign.mu` | External, prominent |
| Theme Toggle | — | Dark/Light mode |
| Dashboard | `/dashboard` | Shown when authenticated |

### Footer
| Column | Links |
|--------|-------|
| About ProDesign | About, Services (→ main site), Training Courses |
| Courses | Revit Foundation, All Courses |
| Support | FAQ, Contact, Terms, Privacy |
| Connect | Social media, Newsletter signup |
| Corporate | Link to prodesign.mu |

---

## Page Priority (MVP)

| Priority | Page | Conversion Role |
|----------|------|-----------------|
| P0 | Home | Awareness → Interest |
| P0 | Course Details | Interest → Decision |
| P0 | Register | Decision → Action |
| P0 | Checkout | Action → Payment |
| P0 | Checkout Success | Confirmation → Trust |
| P1 | Student Dashboard | Retention |
| P1 | Admin Dashboard | Operations |
| P2 | Blog, About, Instructor, FAQ | SEO + Trust |
| P2 | Contact | Support |

---

## Future Course Expansion

| Slug | Title | Status |
|------|-------|--------|
| `revit-foundation` | Autodesk Revit Foundation | **Launch** |
| `revit-advanced` | Revit Advanced | Planned |
| `autocad-foundation` | AutoCAD Foundation | Planned |
| `navisworks` | Navisworks Coordination | Planned |
| `bim-management` | BIM Management | Planned |
| `civil-3d` | Civil 3D Essentials | Planned |
| `construction-management` | Construction Management | Planned |
