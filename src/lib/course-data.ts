import { FUTURE_COURSES } from "@/lib/constants";

export interface InstructorPerson {
  name: string;
  image?: string;
}

export interface Instructor {
  name: string;
  title: string;
  bio: string;
  image?: string;
  credentials: string[];
  experienceYears: number;
  // Individual trainers (name + optional photo) for co-taught courses. When
  // present, each person shows their own avatar in the instructor section.
  people?: InstructorPerson[];
}

export interface CurriculumModule {
  module: number;
  title: string;
  topics: string[];
}

export interface Cohort {
  id: string;
  startDate: string;
  endDate: string;
  schedule: string;
  seatsTotal: number;
  seatsAvailable: number;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface CourseFeature {
  icon: string;
  title: string;
  description: string;
}

export interface Course {
  slug: string;
  title: string;
  description: string;
  overview: string;
  price: number;
  taxRate: number;
  durationHours: number;
  durationDays: number;
  status: "active" | "fully-booked" | "new-cohort-coming-soon" | "coming-soon";
  instructor: Instructor;
  curriculum: CurriculumModule[];
  learningOutcomes: string[];
  features: CourseFeature[];
  faq: FaqItem[];
  cohorts: Cohort[];
  brochureUrl?: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  readTime: number;
  category: string;
}

const REVIT_FOUNDATION: Course = {
  slug: "revit-foundation",
  title: "Foundations of Revit",
  description:
    "An introductory, cross-disciplinary course for professionals and graduates new to Autodesk Revit, building a solid foundation in Building Information Modelling (BIM).",
  overview:
    "This introductory course is designed for professionals and graduates who are new to Autodesk Revit and wish to build a solid foundation in Building Information Modelling (BIM). The training is intentionally structured to be accessible to participants from all disciplines — architecture, structural engineering, MEP engineering, and BIM/CAD — as Revit is a cross-disciplinary platform used by all. By the end of the course, you'll have built a simple multi-storey building model from scratch, produced basic drawings and schedules, and understood how Revit differs fundamentally from traditional 2D CAD. No prior Revit experience is required.",
  price: 15000,
  taxRate: 0,
  durationHours: 6,
  durationDays: 3,
  status: "active",
  instructor: {
    name: "Arvish Ramseebaluck & Lamhesh Narain",
    title: "Revit & BIM Trainer",
    bio: "Our Foundations of Revit trainers bring hands-on BIM and CAD experience spanning architecture, structural, and MEP disciplines. The teaching approach combines guided modelling sessions, real project examples, and practical exercises so every participant — regardless of discipline — leaves with a working multi-storey Revit model.",
    credentials: [
      "Autodesk Revit Practitioners",
      "BIM/CAD Industry Professionals",
      "MQA Approved Training Delivery",
    ],
    experienceYears: 10,
    people: [
      { name: "Arvish Ramseebaluck" },
      { name: "Lamhesh Narain" },
    ],
  },
  curriculum: [
    {
      module: 1,
      title: "What is BIM and Revit?",
      topics: [
        "Introduction to BIM: what it is and why it matters",
        "How BIM differs from AutoCAD",
        "Overview of the Revit platform: disciplines, workflows, and file types",
        "Live demonstration of a completed Revit model",
      ],
    },
    {
      module: 2,
      title: "The Revit Interface",
      topics: [
        "The Revit start screen and interface layout",
        "Ribbon, Quick Access Toolbar, Properties Palette, Project Browser",
        "Navigation: pan, zoom, orbit in 3D",
        "View types: floor plans, elevations, sections, 3D views, schedules",
      ],
    },
    {
      module: 3,
      title: "Project Setup",
      topics: [
        "Creating a new project from a template",
        "Setting project units, location, and information",
        "Creating and modifying Levels, and adding Grids",
        "Introduction to the concept of Phases",
      ],
    },
    {
      module: 4,
      title: "Walls, Doors & Windows",
      topics: [
        "Placing and modifying walls (basic wall types and heights)",
        "Adding doors and windows from the library",
        "Editing element and type properties",
        "Copy, move, mirror, and array tools",
      ],
    },
    {
      module: 5,
      title: "Floors, Roofs & Ceilings",
      topics: [
        "Creating floor slabs",
        "Adding a simple flat and pitched roof",
        "Placing ceilings",
        "Discipline-specific overview: structural slabs vs. architectural floors",
      ],
    },
    {
      module: 6,
      title: "Structural & MEP Basics",
      topics: [
        "Placing columns and beams (structural engineers)",
        "Introduction to MEP spaces and basic component placement (MEP engineers)",
        "How all disciplines link into one federated model",
      ],
    },
    {
      module: 7,
      title: "Documentation & Output",
      topics: [
        "Creating plan views, sections, elevations, and 3D views",
        "Adding tags and annotations",
        "Generating a simple room/space schedule",
        "Setting up a sheet with a title block and placing views",
        "Printing and exporting to PDF",
      ],
    },
    {
      module: 8,
      title: "BIM in Practice",
      topics: [
        "How Revit is used in real projects in Mauritius",
        "Coordination and clash detection overview",
        "Next steps: intermediate course, Revit families, linked models",
      ],
    },
    {
      module: 9,
      title: "Q&A & Certificates",
      topics: [
        "Open question and answer session",
        "Certificate of Completion presented to all participants",
      ],
    },
  ],
  learningOutcomes: [
    "Understand what BIM is and how Revit fits within a BIM workflow",
    "Navigate the Revit interface confidently",
    "Set up a new project with correct levels, grids, and project information",
    "Create and modify basic architectural elements: walls, floors, roofs, doors, and windows",
    "Add structural elements: columns, beams, and slabs",
    "Place MEP spaces and basic MEP components",
    "Generate floor plans, sections, elevations, and 3D views",
    "Create a basic schedule and tag elements in a view",
    "Set up and print sheets with a title block",
    "Understand the link between model changes and drawing updates",
  ],
  features: [
    {
      icon: "Clock",
      title: "3 Sessions, 2 Hours Each",
      description: "Held Monday, Wednesday, and Friday — 6 hours of training in total.",
    },
    {
      icon: "Users",
      title: "Cross-Disciplinary",
      description: "Open to architecture, structural, MEP, and BIM/CAD professionals — no prior Revit experience required.",
    },
    {
      icon: "BadgeCheck",
      title: "MQA Approved Course",
      description: "Recognized training delivery aligned with Mauritius Qualifications Authority standards.",
    },
    {
      icon: "Award",
      title: "Certificate of Completion",
      description: "Awarded to every participant who completes the programme.",
    },
    {
      icon: "Laptop",
      title: "Hands-On Practical Exercises",
      description: "Guided modelling sessions using real project examples.",
    },
    {
      icon: "BookOpen",
      title: "Course Materials",
      description: "Training manual, sample Revit project files, and exercise files included.",
    },
    {
      icon: "MessageCircle",
      title: "Instructor Support via WhatsApp",
      description: "Get follow-up guidance and answers from the training team between sessions.",
    },
  ],
  faq: [
    {
      question: "Do I need prior Revit experience to enroll?",
      answer:
        "No. This course is designed for professionals and graduates who are new to Autodesk Revit, including architecture, structural, MEP, and BIM/CAD backgrounds. No prior Revit or BIM experience is required.",
    },
    {
      question: "What are the entry requirements?",
      answer:
        "A minimum qualification of a Diploma in Engineering or a related field.",
    },
    {
      question: "What will I be able to do by the end of the course?",
      answer:
        "You'll build a simple multi-storey building model from scratch, produce basic drawings and schedules, and understand how Revit differs from traditional 2D CAD.",
    },
    {
      question: "What software and equipment do I need?",
      answer:
        "Autodesk Revit (latest version or training version) is used throughout. A desktop computer is either provided by Prodesign Learning Centre or can be brought by participants — this is confirmed when you register.",
    },
    {
      question: "What is the session schedule?",
      answer:
        "The course runs as three 2-hour sessions held on Monday, Wednesday, and Friday, for 6 hours of training in total.",
    },
    {
      question: "Is the certificate officially recognized?",
      answer:
        "You'll receive a Prodesign Learning Centre Certificate of Completion. This is an MQA Approved course; it is not an official Autodesk certification, but it is recognized by employers across Mauritius's AEC industry.",
    },
    {
      question: "What payment methods are accepted?",
      answer:
        "We accept credit cards, debit cards, and MIPS (Mauritius Interbank Payment System). The course fee is MUR 15,000 with no VAT or additional tax.",
    },
  ],
  cohorts: [
    {
      id: "cohort-2026-08-05",
      startDate: "2026-08-05",
      endDate: "2026-08-07",
      schedule: "5, 6 & 7 August 2026 · 2-hour sessions",
      seatsTotal: 15,
      seatsAvailable: 0,
    },
  ],
  brochureUrl: "/brochures/revit-foundation.pdf",
};

const MANAGING_LEED_PROJECTS: Course = {
  slug: "managing-leed-projects",
  title: "Managing LEED Projects – A Contractor's Perspective",
  description:
    "A practical, execution-focused programme on managing LEED-certified construction projects from a contractor's perspective — procurement, site execution, documentation, and compliance.",
  overview:
    "Developed to strengthen the technical and operational understanding of contractors, construction professionals, project managers, and site personnel involved in sustainable construction and LEED-certified developments, this programme focuses on the practical management of LEED projects from a contractor's perspective — with emphasis on procurement, construction planning, site execution, documentation, coordination, and compliance management. As LEED-certified developments expand globally and regionally, contractors and construction teams need practical knowledge of how sustainability requirements affect project delivery and construction management.",
  price: 9500,
  taxRate: 0,
  durationHours: 8,
  durationDays: 2,
  status: "active",
  instructor: {
    name: "Niraj Boodhoo & Urmila Rupear",
    title: "LEED & Sustainable Construction Trainer",
    bio: "Our LEED training team combines practical contractor-side project delivery experience with sustainable construction expertise, guiding participants through real-world case studies, workshop exercises, and sample LEED documentation review.",
    credentials: [
      "LEED Project Delivery Practitioners",
      "Sustainable Construction Trainers",
      "MQA Approved Training Delivery",
    ],
    experienceYears: 10,
    people: [
      { name: "Niraj Boodhoo" },
      { name: "Urmila Rupear" },
    ],
  },
  curriculum: [
    {
      module: 1,
      title: "LEED in Construction Reality",
      topics: [
        "Why contractors make or break LEED projects",
        "The business case for green construction",
        "Common contractor misconceptions about LEED",
        "Why LEED failures occur during construction",
      ],
    },
    {
      module: 2,
      title: "Understanding LEED Frameworks and Rating Systems",
      topics: [
        "LEED fundamentals and certification levels",
        "LEED v4.1 vs LEED v5",
        "BD+C, ID+C, O+M overview",
        "How certification is achieved",
      ],
    },
    {
      module: 3,
      title: "Contractor Responsibilities by Credit Category",
      topics: [
        "Contractor responsibilities within each LEED credit category",
        "Documentation requirements for contractor-managed credits",
        "Construction quality and LEED compliance",
        "Coordinating with consultants, suppliers, and stakeholders",
      ],
    },
    {
      module: 4,
      title: "Procurement Strategy and Supplier Management",
      topics: [
        "Integrating LEED requirements into procurement",
        "Evaluating supplier documentation for LEED compliance",
        "Common product certifications and environmental declarations",
        "Managing product substitutions and supplier engagement",
      ],
    },
    {
      module: 5,
      title: "Planning and Preconstruction Setup",
      topics: [
        "Incorporating LEED requirements into preconstruction planning",
        "Establishing project-specific LEED management procedures",
        "Compliance tracking systems for documentation and submittals",
        "Preparing site teams for LEED project execution",
      ],
    },
    {
      module: 6,
      title: "Site Execution and LEED Compliance",
      topics: [
        "LEED-related site management practices",
        "Erosion and sedimentation control measures",
        "Material storage, protection, and installation compliance",
        "Routine compliance inspections and corrective actions",
      ],
    },
    {
      module: 7,
      title: "Documentation and Submittals",
      topics: [
        "Importance of documentation in the LEED certification process",
        "Typical construction-phase LEED submittals and supporting evidence",
        "Procedures for collecting, reviewing, and organising documentation",
        "Reducing certification risk from incomplete or inaccurate records",
      ],
    },
    {
      module: 8,
      title: "Construction Waste Management",
      topics: [
        "LEED requirements for construction and demolition waste",
        "Developing and implementing waste management plans",
        "Monitoring waste diversion and recycling performance",
        "Reducing waste and improving resource efficiency on site",
      ],
    },
    {
      module: 9,
      title: "Managing Subcontractors",
      topics: [
        "Communicating LEED requirements to subcontractors and suppliers",
        "Establishing subcontractor compliance expectations",
        "Monitoring subcontractor performance against LEED objectives",
        "Improving project-wide coordination and accountability",
      ],
    },
    {
      module: 10,
      title: "LEED v5 and Future Contractor Responsibilities",
      topics: [
        "Key changes introduced under LEED v5",
        "Emerging sustainability trends in construction",
        "Embodied carbon, resilience, and material transparency",
        "Future skills for sustainable construction delivery",
      ],
    },
    {
      module: 11,
      title: "Case Studies and Failure Analysis",
      topics: [
        "Real-world LEED project successes and failures",
        "Common causes of certification challenges and non-conformities",
        "Lessons learned applied to future construction activities",
        "Practical strategies to improve LEED project delivery and compliance",
      ],
    },
  ],
  learningOutcomes: [
    "Understand the contractor's role in successful LEED project delivery",
    "Identify construction-related risks that may affect LEED compliance",
    "Understand procurement and supplier requirements for LEED projects",
    "Develop practical approaches for managing LEED documentation and submittals",
    "Integrate LEED requirements into construction planning and site operations",
    "Understand emerging requirements under LEED v5",
  ],
  features: [
    {
      icon: "Clock",
      title: "8-Hour Programme, 2 Sessions",
      description: "Two 4-hour sessions delivered face-to-face.",
    },
    {
      icon: "Users",
      title: "Built for Contractors",
      description: "Designed for main contractors, project managers, site engineers, MEP contractors, and quantity surveyors.",
    },
    {
      icon: "BadgeCheck",
      title: "MQA Approved Course",
      description: "Recognized training delivery aligned with Mauritius Qualifications Authority standards.",
    },
    {
      icon: "Award",
      title: "Certificate of Completion",
      description: "Awarded to every participant who completes the programme.",
    },
    {
      icon: "Laptop",
      title: "Case Studies & Workshops",
      description: "Practical exercises, case studies, and review of sample LEED documentation.",
    },
    {
      icon: "BookOpen",
      title: "Course Materials",
      description: "Presentation materials, participant guidance notes, and sample LEED compliance templates included.",
    },
    {
      icon: "MessageCircle",
      title: "Instructor Support via WhatsApp",
      description: "Stay connected with the training team for follow-up questions and practical guidance.",
    },
  ],
  faq: [
    {
      question: "Who should attend this course?",
      answer:
        "Main contractors, project managers, site engineers, MEP contractors, quantity surveyors, construction supervisors, subcontractor coordinators, and other technical personnel involved in project delivery.",
    },
    {
      question: "What are the entry requirements?",
      answer:
        "A minimum qualification of a Diploma in Engineering or a related field.",
    },
    {
      question: "Do I need prior LEED experience?",
      answer:
        "No prior LEED certification is required, though familiarity with construction project delivery is assumed given the course's practical, execution-focused approach.",
    },
    {
      question: "How is the course assessed?",
      answer:
        "Participant understanding may be assessed through workshop participation, practical exercises, and interactive discussions during the training sessions.",
    },
    {
      question: "What will I receive after the course?",
      answer:
        "A Certificate of Completion, along with training presentation materials, participant guidance notes, and sample LEED compliance templates. This is an MQA Approved course.",
    },
    {
      question: "What is the session schedule?",
      answer:
        "The course runs over two days as two 4-hour sessions, for 8 hours of training in total.",
    },
    {
      question: "What payment methods are accepted?",
      answer:
        "We accept credit cards, debit cards, and MIPS (Mauritius Interbank Payment System). The course fee is MUR 9,500 with no VAT or additional tax.",
    },
  ],
  cohorts: [
    {
      id: "cohort-2026-08-03",
      startDate: "2026-08-03",
      endDate: "2026-08-04",
      // NOTE: exact session clock-times not provided — confirm before publishing.
      schedule: "3 & 4 August 2026",
      seatsTotal: 15,
      seatsAvailable: 0,
    },
  ],
  brochureUrl: "/brochures/managing-leed-projects.pdf",
};

const COURSE_MAP: Record<string, Course> = {
  "revit-foundation": REVIT_FOUNDATION,
  "managing-leed-projects": MANAGING_LEED_PROJECTS,
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "why-revit-skills-matter-mauritius",
    title: "Why Revit Skills Matter for Mauritius's Growing Construction Sector",
    excerpt:
      "As Mauritius invests in infrastructure and smart city development, BIM expertise is becoming essential for AEC professionals.",
    content: `Mauritius is experiencing a construction boom driven by tourism infrastructure, residential developments, and government-led smart city initiatives. For architecture students, engineers, and draftsmen, this growth creates unprecedented demand for Building Information Modeling (BIM) skills — particularly Autodesk Revit proficiency.

## The BIM Mandate

Leading developers and government agencies are increasingly requiring BIM deliverables on major projects. Firms that haven't adopted BIM workflows risk being excluded from tender processes. For individual professionals, Revit skills have shifted from "nice to have" to essential.

## Career Impact

Employers across Port Louis, Ebène, and the north consistently list Revit as a top requirement for architectural and engineering roles — and a recognized certificate of completion helps your CV stand out.

## Getting Started

The Prodesign Learning Centre Foundations of Revit course provides a focused, one-day path from zero to a working BIM model. With small class sizes, hands-on exercises, and industry-experienced trainers, you'll leave with practical skills you can demonstrate to employers immediately.

Ready to future-proof your career? Explore our upcoming session and secure your seat today.`,
    author: "Lamhesh Narain",
    publishedAt: "2026-06-01",
    readTime: 5,
    category: "Industry Insights",
  },
  {
    slug: "bim-career-path-beginners-guide",
    title: "A Beginner's Guide to Starting Your BIM Career in 2026",
    excerpt:
      "From student to BIM coordinator — a practical roadmap for breaking into the AEC industry with the right skills and credentials.",
    content: `Starting a BIM career can feel overwhelming with the sheer number of software tools, certifications, and specializations available. This guide breaks down a practical path for beginners in Mauritius.

## Step 1: Master the Foundation

Before diving into advanced coordination or management roles, build solid Revit modeling skills. Focus on architectural modeling, documentation, and basic family creation — these form the backbone of every BIM role.

## Step 2: Build a Portfolio

Employers want to see what you can do. Use your course project files and exported sheets as the start of a portfolio that demonstrates a full BIM workflow, from model creation through documentation.

## Step 3: Get Certified

A Certificate of Completion from a recognized training provider validates your skills objectively. Look for courses that cover modeling, documentation, and collaboration fundamentals — all topics covered in our Foundations of Revit course.

## Step 4: Network Locally

Join Mauritius BIM community events, LinkedIn groups, and Prodesign Learning Centre alumni networks. Many of our graduates found opportunities through referrals and industry connections made during training.

## Step 5: Specialize Over Time

Once foundational skills are solid, consider advanced paths: BIM coordination, sustainable construction (LEED), BIM management, or discipline-specific roles in structural or MEP modeling.

The key is starting with structured, hands-on training rather than trying to learn from scattered YouTube tutorials. Consistency in focused, practical training beats months of unfocused self-study.`,
    author: "Prodesign Learning Centre",
    publishedAt: "2026-05-15",
    readTime: 7,
    category: "Career Guide",
  },
  {
    slug: "revit-foundation-course-preview",
    title: "Inside the Foundations of Revit Course: What to Expect",
    excerpt:
      "A module-by-module preview of our flagship one-day Revit programme, from BIM basics to your first set of drawings.",
    content: `Considering enrolling in the Prodesign Learning Centre Foundations of Revit course? Here's an inside look at what each part of the 6-hour day covers and how you'll progress from beginner to confident first-time modeler.

## Morning: BIM Foundations and Getting Started

You'll start with what BIM is and how Revit fits in, then get comfortable with the interface — the ribbon, Project Browser, navigation, and view types. By the end of the morning, you'll have a new project set up with correct levels and grids.

## Midday: Building the Model

This is where the model takes shape: walls, doors, windows, floors, roofs, ceilings, and — depending on your discipline — structural columns and beams or MEP spaces. You'll see how all disciplines link into one federated model.

## Afternoon: Documentation & Real-World Practice

You'll generate plan views, sections, elevations, and a simple schedule, then set up a sheet with a title block and export to PDF. The day closes with a look at how Revit is used in real Mauritius projects, an open Q&A, and your Certificate of Completion.

## Class Format

- Single 6-hour face-to-face day
- Hands-on, guided modelling exercises throughout
- Course manual and sample project files included
- Open to architecture, structural, MEP, and BIM/CAD backgrounds — no prior Revit experience required

Our next session starts soon with seats still available. Enroll now to secure your place.`,
    author: "Lamhesh Narain",
    publishedAt: "2026-06-10",
    readTime: 6,
    category: "Course Preview",
  },
];

export function getCourseBySlug(slug: string): Course | undefined {
  return COURSE_MAP[slug];
}

export function getAllCourses(): Course[] {
  return FUTURE_COURSES.map((futureCourse) => {
    const fullCourse = COURSE_MAP[futureCourse.slug];
    if (fullCourse) return fullCourse;

    return {
      slug: futureCourse.slug,
      title: futureCourse.title,
      description: `${futureCourse.title} — coming soon to Prodesign Learning Centre.`,
      overview: "",
      price: 0,
      taxRate: 0.15,
      durationHours: 0,
      durationDays: 0,
      status:
        futureCourse.status === "registration-open"
          ? "active"
          : futureCourse.status === "full-booked"
            ? "fully-booked"
          : "coming-soon",
      instructor: REVIT_FOUNDATION.instructor,
      curriculum: [],
      learningOutcomes: [],
      features: [],
      faq: [],
      cohorts: [],
    };
  });
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug);
}

export function getAllBlogPosts(): BlogPost[] {
  return BLOG_POSTS;
}

// Mock data fallbacks for pages when DB is unavailable
export interface MockCourse {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number;
  taxRate: number;
  durationHours: number;
  durationDays: number;
  instructorName: string;
}

export interface MockCohort {
  id: string;
  courseId: string;
  name: string;
  startDate: string;
  schedule: string;
  seatsAvailable: number;
  seatsTotal: number;
}

export interface MockEnrollment {
  id: string;
  userId: string;
  courseId: string;
  cohortId: string;
  status: string;
  course: MockCourse;
  cohort: MockCohort;
}

export interface MockPayment {
  id: string;
  enrollmentId: string;
  amount: number;
  taxAmount: number;
  totalAmount: number;
  currency: string;
  method: string;
  status: string;
  paidAt: string | null;
  createdAt: string;
}

export interface MockStudent {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  role: string;
  createdAt: string;
  enrollmentStatus: string | null;
  courseTitle: string | null;
}

export const MOCK_USER_ID = "mock-user-1";

export const MOCK_COURSES: MockCourse[] = [
  {
    id: "mock-course-revit",
    slug: REVIT_FOUNDATION.slug,
    title: REVIT_FOUNDATION.title,
    description: REVIT_FOUNDATION.description,
    price: REVIT_FOUNDATION.price,
    taxRate: REVIT_FOUNDATION.taxRate,
    durationHours: REVIT_FOUNDATION.durationHours,
    durationDays: REVIT_FOUNDATION.durationDays,
    instructorName: REVIT_FOUNDATION.instructor.name,
  },
  {
    id: "mock-course-leed",
    slug: MANAGING_LEED_PROJECTS.slug,
    title: MANAGING_LEED_PROJECTS.title,
    description: MANAGING_LEED_PROJECTS.description,
    price: MANAGING_LEED_PROJECTS.price,
    taxRate: MANAGING_LEED_PROJECTS.taxRate,
    durationHours: MANAGING_LEED_PROJECTS.durationHours,
    durationDays: MANAGING_LEED_PROJECTS.durationDays,
    instructorName: MANAGING_LEED_PROJECTS.instructor.name,
  },
];

export const MOCK_COHORTS: MockCohort[] = [
  ...REVIT_FOUNDATION.cohorts.map((c) => ({
    id: c.id,
    courseId: "mock-course-revit",
    name: `Foundations of Revit — ${c.startDate}`,
    startDate: c.startDate,
    schedule: c.schedule,
    seatsAvailable: c.seatsAvailable,
    seatsTotal: c.seatsTotal,
  })),
  ...MANAGING_LEED_PROJECTS.cohorts.map((c) => ({
    id: c.id,
    courseId: "mock-course-leed",
    name: `Managing LEED Projects — ${c.startDate}`,
    startDate: c.startDate,
    schedule: c.schedule,
    seatsAvailable: c.seatsAvailable,
    seatsTotal: c.seatsTotal,
  })),
];

export const MOCK_ENROLLMENT: MockEnrollment = {
  id: "mock-enrollment-1",
  userId: MOCK_USER_ID,
  courseId: "mock-course-revit",
  cohortId: MOCK_COHORTS[0]?.id ?? "cohort-2026-07-27",
  status: "PAYMENT_PENDING",
  course: MOCK_COURSES[0],
  cohort: MOCK_COHORTS[0] ?? {
    id: "cohort-2026-07-27",
    courseId: "mock-course-revit",
    name: "Foundations of Revit — 2026-07-27",
    startDate: "2026-07-27",
    schedule: "Mon, Wed & Fri · 2-hour sessions",
    seatsAvailable: 15,
    seatsTotal: 15,
  },
};

export const MOCK_PAYMENTS: MockPayment[] = [
  {
    id: "mock-payment-1",
    enrollmentId: MOCK_ENROLLMENT.id,
    amount: REVIT_FOUNDATION.price,
    taxAmount: Math.round(REVIT_FOUNDATION.price * REVIT_FOUNDATION.taxRate),
    totalAmount: Math.round(REVIT_FOUNDATION.price * (1 + REVIT_FOUNDATION.taxRate)),
    currency: "MUR",
    method: "CREDIT_CARD",
    status: "PENDING",
    paidAt: null,
    createdAt: new Date().toISOString(),
  },
];

export const MOCK_STUDENTS: MockStudent[] = [
  {
    id: MOCK_USER_ID,
    email: "student@example.com",
    firstName: "Priya",
    lastName: "Sundaram",
    phone: "+230 5XXX XXXX",
    role: "STUDENT",
    createdAt: "2026-01-15T10:00:00Z",
    enrollmentStatus: "PAYMENT_PENDING",
    courseTitle: REVIT_FOUNDATION.title,
  },
  {
    id: "mock-user-2",
    email: "marc.lefevre@example.com",
    firstName: "Marc",
    lastName: "Lefevre",
    phone: "+230 5XXX XXXX",
    role: "STUDENT",
    createdAt: "2026-01-10T10:00:00Z",
    enrollmentStatus: "ENROLLED",
    courseTitle: REVIT_FOUNDATION.title,
  },
];

export const MOCK_ANALYTICS = {
  totalStudents: 127,
  totalRevenue: 5850000,
  conversionRate: 68.5,
  pendingPayments: 8,
  enrolledStudents: 89,
  completedPayments: 119,
};
