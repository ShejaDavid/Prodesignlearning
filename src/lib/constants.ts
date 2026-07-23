export const SITE_CONFIG = {
  name: "Prodesign Learning Centre",
  fullName: "Prodesign Learning Centre",
  legalName: "Pro-Design Engineering Consultants Ltd",
  description:
    "Building your skills for a sustainable future. Learn, innovate, and lead. Your pathway to excellence in construction and sustainability.",
  // Same tagline split into 3 lines for display in the hero.
  taglineLines: [
    "Building your skills for a sustainable future.",
    "Learn, Innovate, and Lead.",
    "Your pathway to excellence in construction and sustainability.",
  ],
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  mainSiteUrl: process.env.NEXT_PUBLIC_MAIN_SITE_URL || "https://prodesign.mu",
  email: "admin@prodesign.mu",
  phone: "+230 660 4545",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "+2305XXXXXXX",
  address: "First Floor, Building No.2, Industrial Building, Valentina Industrial Estate, Phoenix, 73553",
  city: "Phoenix",
} as const;

// Course enrollment form (Google Form). Used for "Enroll Now" CTAs on course pages.
// Separate from account creation (/signup) and login (/login).
export const EXTERNAL_REGISTRATION_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSfgazr2IausaaK9Rvx-99EkoEVbONUmlyDt2I8bJaTCEmeXoA/viewform?usp=sharing&ouid=114074525839102479978";

// Shown under the course fee. Our courses are MQA-approved, which makes them
// eligible for HRDC training-levy refunds — surfaced right at the price to
// offset sticker shock. Edit here to change the wording site-wide.
export const PRICE_VALUE_NOTE = "MQA Approved · HRDC Refundable up to 75%";

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/courses", label: "Courses" },
  { href: "/about", label: "About Us" },
  { href: "/instructor", label: "Instructor" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
] as const;

export const FOOTER_LINKS = {
  company: [
    { href: "/about", label: "About Us" },
    { href: "/affiliations", label: "Affiliations" },
    { href: SITE_CONFIG.mainSiteUrl, label: "Main Website", external: true },
    { href: `${SITE_CONFIG.mainSiteUrl}/services`, label: "Our Services", external: true },
  ],
  courses: [
    { href: "/courses/revit-foundation", label: "Revit Foundation" },
    { href: "/courses/managing-leed-projects", label: "Managing LEED Projects" },
    { href: "/courses", label: "All Courses" },
  ],
  support: [
    { href: "/faq", label: "FAQ" },
    { href: "/contact", label: "Contact" },
    { href: "/terms", label: "Terms & Conditions" },
    { href: "/privacy", label: "Privacy Policy" },
  ],
  social: [
    { href: "https://www.linkedin.com/company/prodesign-engineering-consultants-ltd./posts/?feedView=all", label: "LinkedIn" },
    { href: "https://www.facebook.com/ProdesignEngineeringConsultantsLtd", label: "Facebook" },
  ],
} as const;

export const SEO_KEYWORDS = [
  "Revit Course Mauritius",
  "Autodesk Training Mauritius",
  "BIM Training Mauritius",
  "Revit Foundation Course",
  "Revit Certification Mauritius",
  "Autodesk Revit Training",
  "BIM Course Mauritius",
] as const;

export const STATS = [
  { value: 500, suffix: "+", label: "Students Trained" },
  { value: 98, suffix: "%", label: "Satisfaction Rate" },
  { value: 15, suffix: "+", label: "Years Experience" },
  { value: 2, suffix: "+", label: "Industry Courses" },
] as const;

export const COMPANY_SERVICES = [
  {
    title: "BIM Consulting",
    description: "Strategic BIM implementation and workflow optimization for AEC firms.",
    icon: "Building2",
  },
  {
    title: "Architectural Technology",
    description: "Advanced architectural design and documentation services.",
    icon: "PenTool",
  },
  {
    title: "Digital Construction",
    description: "Digital transformation solutions for the construction industry.",
    icon: "HardHat",
  },
  {
    title: "Autodesk Training",
    description: "Professional certification programs for Autodesk software.",
    icon: "GraduationCap",
  },
] as const;

export const TESTIMONIALS = [
  {
    name: "Priya Sundaram",
    role: "Architecture Student, University of Mauritius",
    content:
      "The Revit Foundation course completely transformed my approach to architectural design. I landed my first internship within weeks of completing the program.",
    rating: 5,
  },
  {
    name: "Marc Lefevre",
    role: "Senior Draftsman, ABC Construction",
    content:
      "Professional, comprehensive, and perfectly paced. The instructor's industry experience made all the difference. Highly recommended for anyone in the AEC field.",
    rating: 5,
  },
  {
    name: "Sarah Chen",
    role: "BIM Coordinator, Design Studio MU",
    content:
      "Prodesign's training is world-class. The certificate opened doors for me professionally, and the hands-on approach ensured I could apply skills immediately.",
    rating: 5,
  },
  {
    name: "Jean-Claude Baptiste",
    role: "Project Engineer",
    content:
      "From zero Revit knowledge to producing my first set of drawings in a single day. The curriculum is well-structured and the support throughout was exceptional.",
    rating: 5,
  },
] as const;

export interface FutureCourseEntry {
  slug: string;
  title: string;
  status: "coming-soon" | "full-booked" | "registration-open";
  dates?: string;
  note?: string;
}

export const FUTURE_COURSES: FutureCourseEntry[] = [
  {
    slug: "revit-foundation",
    title: "Autodesk Revit Foundation",
    status: "full-booked",
    note: "Fully booked — next cohort date to be announced",
  },
  {
    slug: "managing-leed-projects",
    title: "Managing LEED Projects – A Contractor's Perspective",
    status: "full-booked",
    note: "Fully booked — next cohort date to be announced",
  },
  {
    slug: "leed-construction-site-compliance",
    title: "LEED Construction Site Compliance",
    status: "coming-soon",
    dates: "24–25 Aug 2026",
  },
  {
    slug: "leed-materials-procurement-supplier-documentation",
    title: "LEED Materials, Procurement and Supplier Documentation",
    status: "registration-open",
    dates: "31 Aug – 1 Sept 2026",
  },
  {
    slug: "leed-testing-commissioning-handover-documentation",
    title: "Managing and Documenting LEED Testing, Commissioning and Project Handover Processes",
    status: "coming-soon",
    dates: "7–8 Sept 2026",
  },
  {
    slug: "leed-documentation-registers-compliance-reporting",
    title: "LEED Documentation, Registers and Compliance Reporting",
    status: "coming-soon",
    dates: "14–15 Sept 2026",
  },
];
