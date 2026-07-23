import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { CheckoutForm } from "@/components/checkout/checkout-form";

interface CheckoutPageProps {
  searchParams: Promise<{ enrollment?: string }>;
}

// Real data only — no mock fallback. Fabricating a fake course to pay for
// here would be actively misleading, not just cosmetic.
async function getEnrollmentData(enrollmentId: string, userId?: string) {
  const enrollment = await db.enrollment.findUnique({
    where: { id: enrollmentId },
    include: { course: true, cohort: true },
  });

  if (!enrollment) return null;
  if (userId && enrollment.userId !== userId) return null;

  return {
    id: enrollment.id,
    courseTitle: enrollment.course.title,
    cohortName: enrollment.cohort.name,
    startDate: enrollment.cohort.startDate.toISOString(),
    schedule: enrollment.cohort.schedule,
    price: Number(enrollment.course.price),
    taxRate: Number(enrollment.course.taxRate),
  };
}

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const session = await auth();
  const { enrollment: enrollmentId } = await searchParams;

  // No enrolment id → nothing to pay for.
  if (!enrollmentId) {
    redirect("/courses");
  }

  const data = await getEnrollmentData(enrollmentId, session?.user?.id);

  if (!data) {
    redirect("/courses");
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <Link href="/" className="inline-flex items-center">
            <Image
              src="/logo.png"
              alt="Prodesign Learning Centre"
              width={151}
              height={76}
              className="h-12 w-auto"
              priority
            />
          </Link>
          <span className="text-sm text-muted-foreground">Secure Checkout</span>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Complete Your Payment</h1>
          <p className="mt-2 text-muted-foreground">
            Secure your seat by completing payment for your selected course
          </p>
        </div>
        <CheckoutForm
          enrollmentId={data.id}
          courseTitle={data.courseTitle}
          cohortName={data.cohortName}
          startDate={data.startDate}
          schedule={data.schedule}
          price={data.price}
          taxRate={data.taxRate}
        />
      </main>
    </div>
  );
}
