# Product Requirements Document (PRD)
## ProDesign Mauritius Training Academy

**Version:** 1.0  
**Date:** June 24, 2026  
**Domain:** academy.prodesign.mu (future) / training.prodesign.mu (launch)  
**Parent Brand:** [prodesign.mu](https://prodesign.mu)

---

## 1. Executive Summary

ProDesign Mauritius Training Academy is a premium, conversion-focused educational portal designed to convert visitors into paid students for Autodesk training programs. The launch course is the **Autodesk Revit Foundation Course**, with architecture supporting future courses (Revit Advanced, AutoCAD, Navisworks, BIM Management, Civil 3D, Construction Management).

The platform must feel like a world-class educational product (Coursera, Udemy Business, Autodesk Learning) while maintaining seamless integration with the main ProDesign corporate website.

**Primary Goal:** Enable a visitor to go from landing page → registration → payment in under 3 minutes.

---

## 2. Problem Statement

Mauritius lacks a locally accessible, premium, trust-building platform for professional Autodesk/BIM training. Prospective students need:
- Clear course information and outcomes
- Professional credibility signals
- Frictionless enrollment and payment
- Ongoing access to enrollment status and materials

---

## 3. Target Audience

| Segment | Needs |
|---------|-------|
| Architecture students | Career-ready BIM skills, certification |
| Engineers & draftsmen | Industry-standard Revit workflows |
| BIM professionals | Upskilling, formal credentials |
| Construction professionals | Collaboration & documentation skills |
| University students | Practical software proficiency |
| Career changers | Structured path into AEC industry |

**Geography:** Mauritius (primary), Indian Ocean region (secondary)

---

## 4. Success Metrics (KPIs)

| Metric | Target (90 days post-launch) |
|--------|------------------------------|
| Landing → Registration conversion | ≥ 8% |
| Registration → Payment conversion | ≥ 65% |
| Full funnel (Landing → Paid) | ≥ 5% |
| Page load (LCP) | < 2.5s |
| Mobile traffic share | ≥ 60% supported |
| Bounce rate (homepage) | < 45% |
| Email open rate (transactional) | ≥ 45% |

---

## 5. User Personas

### Persona A: "Priya" — Architecture Student (22)
- Final-year student at University of Mauritius
- Needs Revit for thesis and job applications
- Mobile-first, compares prices, trusts testimonials
- **Journey:** Google search → Homepage → Course Details → Register → Pay

### Persona B: "Marc" — Draftsman (34)
- 5 years experience, employer may sponsor
- Needs certificate and flexible schedule
- **Journey:** Referral → Course page → Download brochure → Register → Pay

### Persona C: "Admin Sarah" — ProDesign Operations
- Manages enrollments, payments, course updates
- **Journey:** Admin login → Dashboard → Student/payment management

---

## 6. Functional Requirements

### 6.1 Public Website

#### Home Page
- Hero with architectural BIM imagery, headline, dual CTAs (Enroll Now, View Course Details)
- Student success statistics with animated counters
- Trust indicators (Autodesk affiliation, certifications)
- Course countdown timer & live seat availability
- Testimonials carousel
- About ProDesign Mauritius section (services, achievements, link to main site)
- Course comparison section
- Certificate showcase
- Newsletter signup
- Blog preview section

#### Course Details Page
- Overview, learning outcomes, features (duration, schedule, instructor, certificate)
- Week-by-week curriculum
- FAQ accordion
- Testimonials
- Instructor profile
- Download brochure CTA
- Enroll CTA (sticky on mobile)

#### About Training / Instructor / FAQ / Contact
- Dedicated pages with SEO-optimized content
- Contact form with validation
- WhatsApp floating button

#### Blog
- Listing + individual post pages (MDX-ready structure)
- SEO metadata per post

### 6.2 Registration Flow
- Multi-step form (Personal → Professional → Course Selection → Review)
- Fields: first/last name, email, phone, DOB, occupation, company, experience level
- Agreement checkbox (Terms & Privacy)
- Client + server validation (Zod)
- Store in PostgreSQL
- Trigger registration confirmation email (Resend)

### 6.3 Payment Flow
- Stripe-like checkout UI
- Display: course name, price, taxes, total
- Payment methods: Credit Card, Debit Card, MIPS (Mauritius)
- MIPS-ready integration layer
- Success / Failed pages
- Transaction logging, invoice generation
- Payment confirmation email
- Payment status tracking

### 6.4 Student Dashboard
- View enrollment status
- Download invoices
- Payment history
- Course information access
- Profile update

### 6.5 Admin Dashboard
- Student CRUD + search
- Course CRUD (multi-course ready)
- Payment/transaction management
- Analytics: registrations, revenue, conversion rate

### 6.6 Email Automation (Resend)
| Trigger | Email |
|---------|-------|
| Registration complete | Registration Confirmation |
| Payment success | Payment + Enrollment Confirmation |
| 7 days before start | Course Reminder |
| Course completion | Certificate Delivery |

### 6.7 Cross-Site Integration
- "Main Website" nav link → prodesign.mu
- "Back to ProDesign.mu" on all pages
- Consistent logo, colors, typography
- CTAs: "Visit ProDesign Mauritius", "Learn More About Our Services", "Explore Our Design & BIM Solutions"

---

## 7. Non-Functional Requirements

| Category | Requirement |
|----------|-------------|
| Performance | LCP < 2.5s, CLS < 0.1, FID < 100ms |
| Accessibility | WCAG 2.1 AA, keyboard nav, ARIA labels |
| SEO | Metadata, JSON-LD, sitemap, robots.txt |
| Security | HTTPS, hashed passwords, CSRF protection, PCI-ready payment layer |
| Responsiveness | Mobile-first, breakpoints: 640/768/1024/1280/1536 |
| Theming | Dark + Light mode |
| Scalability | Multi-course, multi-cohort architecture |
| Deployment | Vercel + Supabase PostgreSQL |

---

## 8. Design System

| Token | Value |
|-------|-------|
| Primary | `#0F172A` |
| Secondary | `#2563EB` |
| Accent | `#06B6D4` |
| Success | `#10B981` |
| Typography | Inter |
| Spacing | 8px grid |
| Border radius | 16px |
| Effects | Premium shadows, glassmorphism (selective) |

**Animation philosophy:** Subtle, premium — fade-in on scroll, smooth transitions, hover effects, number counters, skeleton loaders. Never excessive.

---

## 9. SEO Strategy

**Primary Keywords:**
- Revit Course Mauritius
- Autodesk Training Mauritius
- BIM Training Mauritius
- Revit Foundation Course
- Revit Certification Mauritius

**Deliverables:** Page metadata, Open Graph, Twitter cards, JSON-LD (Organization, Course, FAQ), sitemap.xml, robots.txt

---

## 10. Pricing & Business Rules

| Item | Value |
|------|-------|
| Revit Foundation Course | MUR 25,000 (configurable) |
| VAT | 15% (Mauritius) |
| Seat limit | 20 per cohort (configurable) |
| Payment deadline | 7 days after registration |

---

## 11. Future Roadmap

| Phase | Features |
|-------|----------|
| v1.0 (Launch) | Revit Foundation, registration, MIPS-ready payment, dashboards |
| v1.1 | MIPS live integration, live seat sync |
| v1.2 | Additional courses (AutoCAD, Navisworks) |
| v2.0 | LMS features, video content, progress tracking |
| v2.1 | academy.prodesign.mu subdomain migration |

---

## 12. Out of Scope (v1.0)

- Live video streaming / LMS content delivery
- Live MIPS production credentials (architecture only)
- Multi-language support
- Mobile native apps

---

## 13. Acceptance Criteria

- [ ] All pages render in light/dark mode
- [ ] Registration stores data and sends email
- [ ] Payment flow completes with success/failure paths
- [ ] Student dashboard shows enrollment after payment
- [ ] Admin can view/manage students and payments
- [ ] SEO files generated (sitemap, robots, structured data)
- [ ] Mobile-responsive on all breakpoints
- [ ] Cross-links to prodesign.mu functional
- [ ] Deployment instructions documented
