import type { MetadataRoute } from "next";
import { SITE_CONFIG, FUTURE_COURSES } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_CONFIG.url;

  const staticPages = [
    "",
    "/courses",
    "/about",
    "/instructor",
    "/faq",
    "/contact",
    "/blog",
    "/login",
    "/signup",
    "/terms",
    "/privacy",
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const coursePages = FUTURE_COURSES.filter(
    (c) => c.status === "registration-open" || c.status === "full-booked"
  ).map(
    (course) => ({
      url: `${baseUrl}/courses/${course.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })
  );

  const blogPosts = ["getting-started-with-revit", "bim-career-mauritius", "why-autodesk-certification"].map(
    (slug) => ({
      url: `${baseUrl}/blog/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })
  );

  return [...staticPages, ...coursePages, ...blogPosts];
}
