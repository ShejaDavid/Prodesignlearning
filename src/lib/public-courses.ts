import "server-only";

import type { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import {
  getCourseBySlug as getLegacyCourseBySlug,
  type Course,
  type CourseFeature,
  type CurriculumModule,
  type FaqItem,
  type Instructor,
} from "@/lib/course-data";
import { FUTURE_COURSES } from "@/lib/constants";

type DbCourseWithCohorts = Prisma.CourseGetPayload<{
  include: { cohorts: true };
}> | null;

type PublicCourseSummary = Pick<
  Course,
  "slug" | "title" | "description" | "price" | "taxRate" | "durationHours" | "durationDays"
> & {
  isActive: boolean;
  nextCohort: Course["cohorts"][number] | null;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function asStringArray(value: Prisma.JsonValue | null | undefined): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

function asCurriculum(value: Prisma.JsonValue | null | undefined): CurriculumModule[] {
  if (!Array.isArray(value)) return [];

  return value.flatMap((item, index) => {
    if (!isRecord(item)) return [];
    const module = typeof item.module === "number" ? item.module : index + 1;
    const title = typeof item.title === "string" ? item.title : "";
    const topics = Array.isArray(item.topics)
      ? item.topics.filter((topic): topic is string => typeof topic === "string")
      : [];

    if (!title) return [];

    return [{ module, title, topics }];
  });
}

function asFeatures(value: Prisma.JsonValue | null | undefined): CourseFeature[] {
  if (!Array.isArray(value)) return [];

  return value.flatMap((item) => {
    if (!isRecord(item)) return [];
    const icon = typeof item.icon === "string" ? item.icon : "Award";
    const title = typeof item.title === "string" ? item.title : "";
    const description = typeof item.description === "string" ? item.description : "";

    if (!title || !description) return [];

    return [{ icon, title, description }];
  });
}

function buildFallbackInstructor(name: string, bio: string): Instructor {
  return {
    name,
    title: "Prodesign Training Team",
    bio,
    credentials: [],
    experienceYears: 0,
  };
}

function buildSeedCourse(slug: string): Prisma.CourseCreateManyInput {
  const roadmapCourse = FUTURE_COURSES.find((course) => course.slug === slug);
  const legacyCourse = getLegacyCourseBySlug(slug);

  const title = legacyCourse?.title ?? roadmapCourse?.title ?? slug;
  const isLeedModule = slug.startsWith("leed-");

  return {
    slug,
    title,
    description:
      legacyCourse?.description ??
      `${title} is being prepared for release. Contact Prodesign to register your interest.`,
    overview:
      legacyCourse?.overview ||
      "Detailed course information will be published here once the programme is ready for enrolment.",
    price: legacyCourse?.price ?? 0,
    taxRate: legacyCourse?.taxRate ?? 0,
    durationHours: legacyCourse?.durationHours ?? (isLeedModule ? 8 : 0),
    durationDays: legacyCourse?.durationDays ?? (isLeedModule ? 2 : 1),
    maxSeats: legacyCourse?.cohorts[0]?.seatsTotal ?? 15,
    instructorName: legacyCourse?.instructor.name ?? "Prodesign Training Team",
    instructorBio:
      legacyCourse?.instructor.bio ??
      "Trainer profile will be added before this course opens for enrolment.",
    curriculum: (legacyCourse?.curriculum ?? []) as unknown as Prisma.InputJsonValue,
    learningOutcomes: (legacyCourse?.learningOutcomes ?? []) as Prisma.InputJsonValue,
    features: (legacyCourse?.features ?? []) as unknown as Prisma.InputJsonValue,
    isActive:
      roadmapCourse?.status === "registration-open" ||
      roadmapCourse?.status === "full-booked",
    isFeatured: slug === "revit-foundation",
  };
}

export async function syncMissingLegacyCourses() {
  const seededSlugs = FUTURE_COURSES.map((course) => course.slug);
  const existing = await db.course.findMany({
    where: { slug: { in: seededSlugs } },
    select: { slug: true },
  });
  const existingSlugs = new Set(existing.map((course) => course.slug));
  const missingSlugs = seededSlugs.filter((slug) => !existingSlugs.has(slug));

  if (missingSlugs.length === 0) return;

  await db.course.createMany({
    data: missingSlugs.map((slug) => buildSeedCourse(slug)),
    skipDuplicates: true,
  });
}

function mapCohorts(
  cohorts: Array<{
    id: string;
    startDate: Date;
    endDate: Date | null;
    schedule: string;
    seatsTotal: number;
    seatsAvailable: number;
  }>
): Course["cohorts"] {
  return cohorts.map((cohort) => ({
    id: cohort.id,
    startDate: cohort.startDate.toISOString(),
    endDate: cohort.endDate?.toISOString() ?? cohort.startDate.toISOString(),
    schedule: cohort.schedule,
    seatsTotal: cohort.seatsTotal,
    seatsAvailable: cohort.seatsAvailable,
  }));
}

function mergeCourseData(
  dbCourse: DbCourseWithCohorts,
  legacyCourse: Course | undefined
): Course | null {
  if (!dbCourse && !legacyCourse) return null;

  const title = dbCourse?.title ?? legacyCourse?.title ?? "";
  const instructor =
    legacyCourse?.instructor ??
    buildFallbackInstructor(
      dbCourse?.instructorName ?? "Prodesign Training Team",
      dbCourse?.instructorBio ?? ""
    );

  return {
    slug: dbCourse?.slug ?? legacyCourse!.slug,
    title,
    description: dbCourse?.description ?? legacyCourse?.description ?? "",
    overview: dbCourse?.overview ?? legacyCourse?.overview ?? "",
    price: dbCourse ? Number(dbCourse.price) : (legacyCourse?.price ?? 0),
    taxRate: dbCourse ? Number(dbCourse.taxRate) : (legacyCourse?.taxRate ?? 0),
    durationHours: dbCourse?.durationHours ?? legacyCourse?.durationHours ?? 0,
    durationDays: dbCourse?.durationDays ?? legacyCourse?.durationDays ?? 1,
    status: dbCourse
      ? dbCourse.isActive
        ? "active"
        : "coming-soon"
      : (legacyCourse?.status ?? "coming-soon"),
    instructor: dbCourse
      ? {
          ...instructor,
          name: dbCourse.instructorName || instructor.name,
          bio: dbCourse.instructorBio || instructor.bio,
        }
      : instructor,
    curriculum:
      legacyCourse?.curriculum.length
        ? legacyCourse.curriculum
        : asCurriculum(dbCourse?.curriculum),
    learningOutcomes:
      legacyCourse?.learningOutcomes.length
        ? legacyCourse.learningOutcomes
        : asStringArray(dbCourse?.learningOutcomes),
    features:
      legacyCourse?.features.length
        ? legacyCourse.features
        : asFeatures(dbCourse?.features),
    faq: legacyCourse?.faq ?? ([] as FaqItem[]),
    cohorts:
      dbCourse?.cohorts && dbCourse.cohorts.length > 0
        ? mapCohorts(dbCourse.cohorts)
        : (legacyCourse?.cohorts ?? []),
    brochureUrl: legacyCourse?.brochureUrl,
  };
}

export async function getPublicCourses(): Promise<PublicCourseSummary[]> {
  await syncMissingLegacyCourses();

  const courses = await db.course.findMany({
    include: {
      cohorts: {
        orderBy: { startDate: "asc" },
      },
    },
  });

  const roadmapOrder = new Map<string, number>(
    FUTURE_COURSES.map((course, index) => [course.slug, index])
  );

  return courses
    .map((course) => {
      const legacyCourse = getLegacyCourseBySlug(course.slug);
      const dbCohorts = mapCohorts(course.cohorts);

      return {
        slug: course.slug,
        title: course.title,
        description: course.description,
        price: Number(course.price),
        taxRate: Number(course.taxRate),
        durationHours: course.durationHours,
        durationDays: course.durationDays,
        isActive: course.isActive,
        nextCohort: dbCohorts[0] ?? legacyCourse?.cohorts[0] ?? null,
      };
    })
    .sort((a, b) => {
      const aIndex = roadmapOrder.get(a.slug) ?? Number.MAX_SAFE_INTEGER;
      const bIndex = roadmapOrder.get(b.slug) ?? Number.MAX_SAFE_INTEGER;
      if (aIndex !== bIndex) return aIndex - bIndex;
      return a.title.localeCompare(b.title);
    });
}

export async function getPublicCourseBySlug(slug: string): Promise<Course | null> {
  await syncMissingLegacyCourses();

  const [dbCourse, legacyCourse] = await Promise.all([
    db.course.findUnique({
      where: { slug },
      include: {
        cohorts: {
          orderBy: { startDate: "asc" },
        },
      },
    }),
    Promise.resolve(getLegacyCourseBySlug(slug)),
  ]);

  return mergeCourseData(dbCourse, legacyCourse);
}
