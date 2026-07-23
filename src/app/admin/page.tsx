import { db } from "@/lib/db";
import { StatsOverview } from "@/components/admin/stats-overview";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { EXTERNAL_REGISTRATION_URL } from "@/lib/constants";
import { Users, DollarSign, TrendingUp, Clock } from "lucide-react";

export const dynamic = "force-dynamic";

async function getAnalytics() {
  try {
    const [totalStudents, completedPayments, pendingPayments, revenueAgg] =
      await Promise.all([
        db.user.count({ where: { role: "STUDENT" } }),
        db.payment.count({ where: { status: "COMPLETED" } }),
        db.payment.count({ where: { status: { in: ["PENDING", "PROCESSING"] } } }),
        db.payment.aggregate({
          where: { status: "COMPLETED" },
          _sum: { totalAmount: true },
        }),
      ]);

    const totalRegistrations = await db.enrollment.count();
    const conversionRate =
      totalRegistrations > 0
        ? Math.round((completedPayments / totalRegistrations) * 1000) / 10
        : 0;

    return {
      totalStudents,
      totalRevenue: Number(revenueAgg._sum.totalAmount ?? 0),
      conversionRate,
      pendingPayments,
      fromDb: true,
    };
  } catch {
    return {
      totalStudents: 0,
      totalRevenue: 0,
      conversionRate: 0,
      pendingPayments: 0,
      fromDb: false,
    };
  }
}

// Real service status, derived from actual configuration and the live DB check —
// not hardcoded. Reflects what this deployment is actually wired to.
function getServiceStatus(dbConnected: boolean) {
  const emailLive = Boolean(process.env.RESEND_API_KEY);
  const provider = (process.env.PAYMENT_PROVIDER || "mock").toLowerCase();
  const paymentsLive = provider === "mips" && Boolean(process.env.MIPS_API_KEY);
  const registrationConfigured = Boolean(EXTERNAL_REGISTRATION_URL);

  return [
    {
      label: "Database",
      value: dbConnected ? "Connected" : "Unavailable",
      ok: dbConnected,
    },
    {
      label: "Registration",
      value: registrationConfigured ? "External form" : "Not configured",
      ok: registrationConfigured,
    },
    {
      label: "Payment Gateway",
      value: paymentsLive ? "Live (MIPS)" : `Mock (${provider})`,
      ok: paymentsLive,
    },
    {
      label: "Email Service",
      value: emailLive ? "Operational (Resend)" : "Mock (console)",
      ok: emailLive,
    },
  ];
}

export default async function AdminPage() {
  const analytics = await getAnalytics();
  const services = getServiceStatus(analytics.fromDb);

  const stats = [
    { label: "Total Students", value: analytics.totalStudents, icon: Users },
    {
      label: "Total Revenue",
      value: formatCurrency(analytics.totalRevenue),
      icon: DollarSign,
    },
    {
      label: "Conversion Rate",
      value: `${analytics.conversionRate}%`,
      icon: TrendingUp,
    },
    { label: "Pending Payments", value: analytics.pendingPayments, icon: Clock },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Analytics Overview</h1>
        <p className="text-muted-foreground mt-1">
          Monitor academy performance and key metrics
        </p>
      </div>

      {!analytics.fromDb && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          Live admin metrics are unavailable because the database could not be reached.
        </div>
      )}

      <StatsOverview stats={stats} />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <a
              href="/admin/enroll"
              className="block rounded-xl border border-border p-3 hover:bg-muted transition-colors"
            >
              Enrol a Student →
            </a>
            <a
              href="/admin/students"
              className="block rounded-xl border border-border p-3 hover:bg-muted transition-colors"
            >
              Manage Students →
            </a>
            <a
              href="/admin/courses"
              className="block rounded-xl border border-border p-3 hover:bg-muted transition-colors"
            >
              Manage Courses →
            </a>
            <a
              href="/admin/payments"
              className="block rounded-xl border border-border p-3 hover:bg-muted transition-colors"
            >
              View Payments →
            </a>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {services.map((service) => (
              <div key={service.label} className="flex justify-between">
                <span className="text-muted-foreground">{service.label}</span>
                <span
                  className={`font-medium ${
                    service.ok ? "text-success" : "text-amber-600"
                  }`}
                >
                  {service.value}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
