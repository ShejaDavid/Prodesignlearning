import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface AdminPayment {
  id: string;
  method: string;
  status: string;
  totalAmount: number;
  createdAt: Date;
  user?: { firstName: string; lastName: string; email: string };
  enrollment?: { course?: { title: string } };
}

async function getPayments(): Promise<{ payments: AdminPayment[]; fromDb: boolean }> {
  try {
    const payments = await db.payment.findMany({
      include: {
        user: { select: { firstName: true, lastName: true, email: true } },
        enrollment: { include: { course: { select: { title: true } } } },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return {
      fromDb: true,
      payments: payments.map((p) => ({
        id: p.id,
        method: p.method,
        status: p.status,
        totalAmount: Number(p.totalAmount),
        createdAt: p.createdAt,
        user: p.user,
        enrollment: p.enrollment,
      })),
    };
  } catch {
    return { fromDb: false, payments: [] };
  }
}

export default async function AdminPaymentsPage() {
  const { payments, fromDb } = await getPayments();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Payment Transactions</h1>
        <p className="text-muted-foreground mt-1">Monitor all payment activity across the academy</p>
      </div>

      {!fromDb && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          Payments could not be loaded from the database right now.
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium">Student</th>
                  <th className="pb-3 font-medium">Course</th>
                  <th className="pb-3 font-medium">Method</th>
                  <th className="pb-3 font-medium">Amount</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id} className="border-b border-border last:border-0">
                    <td className="py-3">{formatDate(payment.createdAt)}</td>
                    <td className="py-3">
                      {payment.user
                        ? `${payment.user.firstName} ${payment.user.lastName}`
                        : "—"}
                    </td>
                    <td className="py-3">{payment.enrollment?.course?.title ?? "—"}</td>
                    <td className="py-3 capitalize">{payment.method.replace(/_/g, " ").toLowerCase()}</td>
                    <td className="py-3 font-medium">{formatCurrency(payment.totalAmount)}</td>
                    <td className="py-3">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        payment.status === "COMPLETED"
                          ? "bg-success/10 text-success"
                          : payment.status === "FAILED"
                            ? "bg-red-50 text-red-600"
                            : "bg-amber-50 text-amber-600"
                      }`}>
                        {payment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {fromDb && payments.length === 0 && (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No payment transactions yet.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
