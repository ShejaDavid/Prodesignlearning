import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Script from "next/script";
import { ArrowLeft, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/ui/fade-in";
import { SITE_CONFIG } from "@/lib/constants";
import { getAllBlogPosts, getBlogPostBySlug } from "@/lib/course-data";
import { formatDate } from "@/lib/utils";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllBlogPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return { title: "Post Not Found" };
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `${SITE_CONFIG.url}/blog/${post.slug}`,
      siteName: SITE_CONFIG.name,
      type: "article",
      publishedTime: post.publishedAt,
      authors: [post.author],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    },
  };
}

function renderMarkdownContent(content: string) {
  const blocks = content.split("\n\n");

  return blocks.map((block, index) => {
    if (block.startsWith("## ")) {
      return (
        <h2 key={index} className="mt-8 text-2xl font-bold">
          {block.replace("## ", "")}
        </h2>
      );
    }
    return (
      <p key={index} className="mt-4 leading-relaxed text-muted-foreground">
        {block}
      </p>
    );
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    author: {
      "@type": "Person",
      name: post.author,
    },
    datePublished: post.publishedAt,
    publisher: {
      "@type": "Organization",
      name: SITE_CONFIG.fullName,
      url: SITE_CONFIG.url,
    },
  };

  return (
    <>
      <Script
        id={`blog-jsonld-${post.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <article className="min-h-screen">
        <section className="border-b border-border bg-muted/30 py-16 md:py-24">
          <div className="container mx-auto max-w-3xl px-4">
            <FadeIn>
              <Button variant="ghost" size="sm" className="mb-6 -ml-2" asChild>
                <Link href="/blog">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Blog
                </Link>
              </Button>
              <span className="inline-block rounded-full bg-secondary/10 px-3 py-1 text-xs font-medium text-secondary">
                {post.category}
              </span>
              <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
                {post.title}
              </h1>
              <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span>{post.author}</span>
                <span>{formatDate(post.publishedAt)}</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {post.readTime} min read
                </span>
              </div>
            </FadeIn>
          </div>
        </section>

        <section className="container mx-auto max-w-3xl px-4 py-16">
          <FadeIn delay={0.1}>
            <div className="prose prose-lg max-w-none">
              {renderMarkdownContent(post.content)}
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="mt-16 rounded-2xl border border-border bg-muted/30 p-8 text-center">
              <h2 className="text-xl font-bold">Ready to start learning Revit?</h2>
              <p className="mt-3 text-muted-foreground">
                Join our next Revit Foundation cohort and build job-ready BIM skills.
              </p>
              <Button variant="premium" className="mt-6" asChild>
                <Link href="/courses/revit-foundation">View Course Details</Link>
              </Button>
            </div>
          </FadeIn>
        </section>
      </article>
    </>
  );
}
