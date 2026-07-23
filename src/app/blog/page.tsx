import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FadeIn } from "@/components/ui/fade-in";
import { SITE_CONFIG, SEO_KEYWORDS } from "@/lib/constants";
import { getAllBlogPosts } from "@/lib/course-data";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Insights on BIM, Revit, and career development in Mauritius's AEC industry from Prodesign Learning Centre.",
  keywords: [...SEO_KEYWORDS, "BIM blog", "Revit tips Mauritius"],
};

export default function BlogPage() {
  const posts = getAllBlogPosts();

  return (
    <div className="min-h-screen">
      <section className="border-b border-border bg-muted/30 py-16 md:py-24">
        <div className="container mx-auto max-w-7xl px-4">
          <FadeIn>
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
              Academy <span className="gradient-text">Blog</span>
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
              Industry insights, career guides, and course updates from the{" "}
              {SITE_CONFIG.name} team.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="container mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => (
            <FadeIn key={post.slug} delay={index * 0.05}>
              <Card className="flex h-full flex-col transition-shadow hover:premium-shadow">
                <CardHeader>
                  <span className="mb-2 inline-block w-fit rounded-full bg-secondary/10 px-3 py-1 text-xs font-medium text-secondary">
                    {post.category}
                  </span>
                  <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                  <CardDescription className="line-clamp-3">
                    {post.excerpt}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{post.author}</span>
                    <span>{formatDate(post.publishedAt)}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {post.readTime} min read
                    </span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="link" className="h-auto p-0" asChild>
                    <Link href={`/blog/${post.slug}`}>
                      Read Article
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </FadeIn>
          ))}
        </div>
      </section>
    </div>
  );
}
