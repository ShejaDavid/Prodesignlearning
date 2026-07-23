import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Placeholder supporting video. Admins replace these with their own unlisted
  // YouTube/Vimeo URLs via the admin panel. A public royalty-free clip is used
  // here so the gated player renders something during development.
  const SAMPLE_VIDEO_URL = "https://www.youtube.com/watch?v=aqz-KE-bpKQ";

  const adminPassword = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@prodesign.mu" },
    update: {},
    create: {
      email: "admin@prodesign.mu",
      passwordHash: adminPassword,
      role: "ADMIN",
      firstName: "Admin",
      lastName: "Prodesign",
      phone: "+230 660 4545",
    },
  });
  console.log("Admin user created:", admin.email);

  const revitModules = [
    { module: 1, title: "What is BIM and Revit?", topics: ["Introduction to BIM and why it matters", "How BIM differs from AutoCAD", "Overview of the Revit platform", "Live demonstration of a completed Revit model"] },
    { module: 2, title: "The Revit Interface", topics: ["Start screen and interface layout", "Ribbon, Quick Access Toolbar, Properties Palette, Project Browser", "Navigation: pan, zoom, orbit in 3D", "View types: plans, elevations, sections, 3D, schedules"] },
    { module: 3, title: "Project Setup", topics: ["Creating a new project from template", "Setting project units, location, and information", "Creating and modifying Levels, adding Grids", "Introduction to Phases"] },
    { module: 4, title: "Walls, Doors & Windows", topics: ["Placing and modifying walls", "Adding doors and windows from the library", "Editing element and type properties", "Copy, move, mirror, and array tools"] },
    { module: 5, title: "Floors, Roofs & Ceilings", topics: ["Creating floor slabs", "Adding flat and pitched roofs", "Placing ceilings", "Structural slabs vs. architectural floors"] },
    { module: 6, title: "Structural & MEP Basics", topics: ["Placing columns and beams", "MEP spaces and basic component placement", "How disciplines link into one federated model"] },
    { module: 7, title: "Documentation & Output", topics: ["Plan views, sections, elevations, 3D views", "Tags and annotations", "Simple room/space schedules", "Sheet setup, title blocks, and PDF export"] },
    { module: 8, title: "BIM in Practice", topics: ["How Revit is used in real Mauritius projects", "Coordination and clash detection overview", "Next steps: intermediate course, families, linked models"] },
    { module: 9, title: "Q&A & Certificates", topics: ["Open question and answer session", "Certificate of Completion presented to all participants"] },
  ];

  const revitCourse = await prisma.course.upsert({
    where: { slug: "revit-foundation" },
    update: {},
    create: {
      slug: "revit-foundation",
      title: "Foundations of Revit",
      description:
        "An introductory, cross-disciplinary course for professionals and graduates new to Autodesk Revit and BIM.",
      overview:
        "This introductory course is designed for professionals and graduates who are new to Autodesk Revit and wish to build a solid foundation in Building Information Modelling (BIM). Accessible to participants from architecture, structural engineering, MEP engineering, and BIM/CAD backgrounds — no prior Revit experience required.",
      price: 7500,
      taxRate: 0,
      durationHours: 6,
      durationDays: 3,
      maxSeats: 15,
      instructorName: "Arvish Ramseebaluck & Lamhesh Narain",
      instructorBio:
        "Our Foundations of Revit trainers bring hands-on BIM and CAD experience spanning architecture, structural, and MEP disciplines in Mauritius, delivering practical, project-based instruction.",
      instructorImage: "/images/instructor.jpg",
      isActive: true,
      isFeatured: true,
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
      ],
      features: [
        "3 sessions of 2 hours each — Monday, Wednesday & Friday",
        "Hands-on, project-based learning",
        "MQA Approved course",
        "Certificate of Completion",
        "Small class sizes (max 15 participants)",
        "Open to all AEC disciplines — no prior Revit experience required",
        "Course manual and sample project files included",
      ],
      curriculum: revitModules,
    },
  });
  console.log("Course created:", revitCourse.title);

  for (const mod of revitModules) {
    const moduleId = `${revitCourse.id}-module-${mod.module}`;
    await prisma.courseModule.upsert({
      where: { id: moduleId },
      update: {},
      create: {
        id: moduleId,
        courseId: revitCourse.id,
        moduleNumber: mod.module,
        title: mod.title,
        description: `Module ${mod.module}: ${mod.title}`,
        topics: mod.topics,
        sortOrder: mod.module,
      },
    });

    await prisma.video.upsert({
      where: { id: `${moduleId}-video-1` },
      update: {},
      create: {
        id: `${moduleId}-video-1`,
        moduleId,
        title: `${mod.title} — Walkthrough`,
        description: `Supporting video for module ${mod.module}.`,
        url: SAMPLE_VIDEO_URL,
        durationMinutes: 12,
        sortOrder: 1,
        isPreview: mod.module === 1,
      },
    });
  }

  const revitCohort = await prisma.cohort.upsert({
    where: { id: "cohort-2026-07-27" },
    update: {},
    create: {
      id: "cohort-2026-07-27",
      courseId: revitCourse.id,
      name: "Foundations of Revit — 27 July 2026",
      startDate: new Date("2026-07-27"),
      endDate: new Date("2026-07-31"),
      schedule: "Mon, Wed & Fri · 2-hour sessions",
      deliveryMethod: "IN_PERSON",
      venue: "Prodesign Learning Centre, Ebène",
      seatsTotal: 15,
      seatsAvailable: 15,
      status: "UPCOMING",
    },
  });
  console.log("Cohort created:", revitCohort.name);

  const leedModules = [
    { module: 1, title: "LEED in Construction Reality", topics: ["Why contractors make or break LEED projects", "The business case for green construction", "Common contractor misconceptions about LEED", "Why LEED failures occur during construction"] },
    { module: 2, title: "Understanding LEED Frameworks and Rating Systems", topics: ["LEED fundamentals and certification levels", "LEED v4.1 vs LEED v5", "BD+C, ID+C, O+M overview", "How certification is achieved"] },
    { module: 3, title: "Contractor Responsibilities by Credit Category", topics: ["Contractor responsibilities within each LEED credit category", "Documentation requirements for contractor-managed credits", "Construction quality and LEED compliance", "Coordinating with consultants, suppliers, and stakeholders"] },
    { module: 4, title: "Procurement Strategy and Supplier Management", topics: ["Integrating LEED requirements into procurement", "Evaluating supplier documentation for LEED compliance", "Common product certifications and environmental declarations", "Managing product substitutions and supplier engagement"] },
    { module: 5, title: "Planning and Preconstruction Setup", topics: ["Incorporating LEED requirements into preconstruction planning", "Establishing project-specific LEED management procedures", "Compliance tracking systems for documentation and submittals", "Preparing site teams for LEED project execution"] },
    { module: 6, title: "Site Execution and LEED Compliance", topics: ["LEED-related site management practices", "Erosion and sedimentation control measures", "Material storage, protection, and installation compliance", "Routine compliance inspections and corrective actions"] },
    { module: 7, title: "Documentation and Submittals", topics: ["Importance of documentation in the LEED certification process", "Typical construction-phase LEED submittals and supporting evidence", "Procedures for collecting, reviewing, and organising documentation", "Reducing certification risk from incomplete or inaccurate records"] },
    { module: 8, title: "Construction Waste Management", topics: ["LEED requirements for construction and demolition waste", "Developing and implementing waste management plans", "Monitoring waste diversion and recycling performance", "Reducing waste and improving resource efficiency on site"] },
    { module: 9, title: "Managing Subcontractors", topics: ["Communicating LEED requirements to subcontractors and suppliers", "Establishing subcontractor compliance expectations", "Monitoring subcontractor performance against LEED objectives", "Improving project-wide coordination and accountability"] },
    { module: 10, title: "LEED v5 and Future Contractor Responsibilities", topics: ["Key changes introduced under LEED v5", "Emerging sustainability trends in construction", "Embodied carbon, resilience, and material transparency", "Future skills for sustainable construction delivery"] },
    { module: 11, title: "Case Studies and Failure Analysis", topics: ["Real-world LEED project successes and failures", "Common causes of certification challenges and non-conformities", "Lessons learned applied to future construction activities", "Practical strategies to improve LEED project delivery and compliance"] },
  ];

  const leedCourse = await prisma.course.upsert({
    where: { slug: "managing-leed-projects" },
    update: {},
    create: {
      slug: "managing-leed-projects",
      title: "Managing LEED Projects – A Contractor's Perspective",
      description:
        "A practical, execution-focused programme on managing LEED-certified construction projects from a contractor's perspective — procurement, site execution, documentation, and compliance.",
      overview:
        "Developed to strengthen the technical and operational understanding of contractors, construction professionals, project managers, and site personnel involved in sustainable construction and LEED-certified developments, this programme focuses on the practical management of LEED projects from a contractor's perspective.",
      price: 9500,
      taxRate: 0,
      durationHours: 8,
      durationDays: 2,
      maxSeats: 15,
      instructorName: "Niraj Boodhoo & Urmila Rupear",
      instructorBio:
        "Our LEED training team combines practical contractor-side project delivery experience with sustainable construction expertise, guiding participants through real-world case studies, workshop exercises, and sample LEED documentation review.",
      instructorImage: "/images/instructor-leed.jpg",
      isActive: true,
      isFeatured: false,
      learningOutcomes: [
        "Understand the contractor's role in successful LEED project delivery",
        "Identify construction-related risks that may affect LEED compliance",
        "Understand procurement and supplier requirements for LEED projects",
        "Develop practical approaches for managing LEED documentation and submittals",
        "Integrate LEED requirements into construction planning and site operations",
        "Understand emerging requirements under LEED v5",
      ],
      features: [
        "8-hour programme — two 4-hour sessions delivered face-to-face",
        "Built for main contractors, project managers, and site engineers",
        "MQA Approved course",
        "Certificate of Completion",
        "Case studies and workshop exercises",
        "Sample LEED compliance templates included",
      ],
      curriculum: leedModules,
    },
  });
  console.log("Course created:", leedCourse.title);

  for (const mod of leedModules) {
    const moduleId = `${leedCourse.id}-module-${mod.module}`;
    await prisma.courseModule.upsert({
      where: { id: moduleId },
      update: {},
      create: {
        id: moduleId,
        courseId: leedCourse.id,
        moduleNumber: mod.module,
        title: mod.title,
        description: `Module ${mod.module}: ${mod.title}`,
        topics: mod.topics,
        sortOrder: mod.module,
      },
    });

    await prisma.video.upsert({
      where: { id: `${moduleId}-video-1` },
      update: {},
      create: {
        id: `${moduleId}-video-1`,
        moduleId,
        title: `${mod.title} — Walkthrough`,
        description: `Supporting video for module ${mod.module}.`,
        url: SAMPLE_VIDEO_URL,
        durationMinutes: 12,
        sortOrder: 1,
        isPreview: mod.module === 1,
      },
    });
  }

  const leedCohort = await prisma.cohort.upsert({
    where: { id: "cohort-2026-08-10" },
    update: {},
    create: {
      id: "cohort-2026-08-10",
      courseId: leedCourse.id,
      name: "Managing LEED Projects — 10–11 August 2026",
      startDate: new Date("2026-08-10"),
      endDate: new Date("2026-08-11"),
      schedule: "Two 4-hour sessions delivered face-to-face.",
      deliveryMethod: "IN_PERSON",
      venue: "Prodesign Learning Centre, Ebène",
      seatsTotal: 15,
      seatsAvailable: 0,
      status: "UPCOMING",
    },
  });
  console.log("Cohort created:", leedCohort.name);

  // Test student with an active enrolment, so the gated learn page can be
  // exercised end-to-end. Login: student@prodesign.mu / student123
  const studentPassword = await bcrypt.hash("student123", 12);
  const student = await prisma.user.upsert({
    where: { email: "student@prodesign.mu" },
    update: {},
    create: {
      email: "student@prodesign.mu",
      passwordHash: studentPassword,
      role: "STUDENT",
      firstName: "Sarah",
      lastName: "Doe",
      phone: "+230 5000 0000",
    },
  });
  console.log("Student user created:", student.email);

  const enrollment = await prisma.enrollment.upsert({
    where: { userId_cohortId: { userId: student.id, cohortId: revitCohort.id } },
    update: {},
    create: {
      userId: student.id,
      courseId: revitCourse.id,
      cohortId: revitCohort.id,
      status: "ENROLLED",
      enrolledAt: new Date(),
      accessExpiresAt: new Date("2026-12-31"),
    },
  });
  console.log("Enrollment created:", enrollment.id, "→", student.email);

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
