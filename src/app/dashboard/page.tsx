import Link from "next/link";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { StatusCard } from "@/components/dashboard/status-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import { MOCK_ENROLLMENT, MOCK_PAYMENTS } from "@/lib/course-data";
import { GraduationCap, CreditCard, FileText, Clock, ArrowRight } from "lucide-react";

async function getDashboardData(userId: string) {
  try {
    const [enrollment, payments, invoices] = await Promise.all([
      db.enrollment.findFirst({
        where: { userId },
        include: { course: true, cohort: true },
        orderBy: { createdAt: "desc" },
      }),
      db.payment.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      db.invoice.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]);

    return { enrollment, payments, invoices, isMock: false };
  } catch {
    return {
      enrollment: {
        id: MOCK_ENROLLMENT.id,
        status: MOCK_ENROLLMENT.status,
        course: { title: MOCK_ENROLLMENT.course.title },
        cohort: {
          name: MOCK_ENROLLMENT.cohort.name,
          startDate: new Date(MOCK_ENROLLMENT.cohort.startDate),
          schedule: MOCK_ENROLLMENT.cohort.schedule,
        },
      },
      payments: MOCK_PAYMENTS.map((p) => ({
        ...p,
        amount: p.amount,
        totalAmount: p.totalAmount,
        createdAt: new Date(p.createdAt),
      })),
      invoices: [],
      isMock: true,
    };
  }
}

export default async function DashboardPage() {
  const session = await auth();
  const userId = session!.user!.id;
  const { enrollment, payments, invoices } = await getDashboardData(userId);

  const pendingPayment = payments.find((p) => p.status === "PENDING" || p.status === "PROCESSING");
  const hasEnrollment = Boolean(enrollment);
  const hasActiveEnrollment = enrollment?.status === "ENROLLED";
  const statusLabel = hasEnrollment
    ? enrollment!.status.replace(/_/g, " ")
    : "Pending review";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Welcome back, {session?.user?.name?.split(" ")[0]}</h1>
        <p className="text-muted-foreground mt-1">
          {hasEnrollment
            ? "Here&apos;s an overview of your training journey"
            : "Your account is ready. Course access appears once your enrolment is confirmed."}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatusCard
          title="Enrollment Status"
          value={statusLabel}
          icon={GraduationCap}
          variant={hasActiveEnrollment ? "success" : "warning"}
        />
        <StatusCard
          title="Course"
          value={enrollment?.course?.title ?? "Awaiting assignment"}
          icon={Clock}
          variant="info"
        />
        <StatusCard
          title="Payments"
          value={`${payments.filter((p) => p.status === "COMPLETED").length} completed`}
          description={pendingPayment ? "1 payment pending" : undefined}
          icon={CreditCard}
          variant={pendingPayment ? "warning" : "success"}
        />
        <StatusCard
          title="Invoices"
          value={String(invoices.length)}
          icon={FileText}
        />
      </div>

      {!hasActiveEnrollment && (
        <Card>
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div>
              <CardTitle>Registration Received</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Your account has been created, but course access is still pending.
                We&apos;ll unlock your cohort once your registration and payment are
                confirmed.
              </p>
            </div>
            <Button asChild size="sm" variant="outline">
              <Link href="/courses">
                View Courses
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-3 text-sm">
            <div className="rounded-xl bg-muted/40 p-4">
              <p className="font-medium text-foreground">Account created</p>
              <p className="mt-1 text-muted-foreground">
                You can sign in and follow updates from this dashboard.
              </p>
            </div>
            <div className="rounded-xl bg-muted/40 p-4">
              <p className="font-medium text-foreground">Admin review</p>
              <p className="mt-1 text-muted-foreground">
                Our team assigns your cohort and confirms your enrolment status.
              </p>
            </div>
            <div className="rounded-xl bg-muted/40 p-4">
              <p className="font-medium text-foreground">Course access</p>
              <p className="mt-1 text-muted-foreground">
                My Courses and protected materials appear as soon as you&apos;re enrolled.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {enrollment && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Current Enrollment</CardTitle>
            {enrollment.status === "PAYMENT_PENDING" && (
              <Button asChild size="sm" variant="premium">
                <Link href={`/checkout?enrollment=${enrollment.id}`}>Complete Payment</Link>
              </Button>
            )}
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Course</p>
                <p className="font-medium">{enrollment.course.title}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Cohort</p>
                <p className="font-medium">{enrollment.cohort.name}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Start Date</p>
                <p className="font-medium">{formatDate(enrollment.cohort.startDate)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {payments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {payments.slice(0, 3).map((payment) => (
                <div key={payment.id} className="flex items-center justify-between text-sm border-b border-border pb-3 last:border-0">
                  <div>
                    <p className="font-medium">{formatCurrency(Number(payment.totalAmount))}</p>
                    <p className="text-muted-foreground">{formatDate(payment.createdAt)}</p>
                  </div>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    payment.status === "COMPLETED"
                      ? "bg-success/10 text-success"
                      : "bg-amber-50 text-amber-600"
                  }`}>
                    {payment.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
