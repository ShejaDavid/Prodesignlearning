import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/utils";
import { MOCK_PAYMENTS } from "@/lib/course-data";

async function getPayments(userId: string) {
  try {
    return await db.payment.findMany({
      where: { userId },
      include: { enrollment: { include: { course: true } } },
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return MOCK_PAYMENTS.map((p) => ({
      ...p,
      enrollment: { course: { title: "Autodesk Revit Foundation" } },
      createdAt: new Date(p.createdAt),
      paidAt: p.paidAt ? new Date(p.paidAt) : null,
    }));
  }
}

export default async function PaymentsPage() {
  const session = await auth();
  const payments = await getPayments(session!.user!.id);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Payment History</h1>

      <Card>
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {payments.length === 0 ? (
            <p className="text-muted-foreground text-sm py-8 text-center">No payments yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-muted-foreground">
                    <th className="pb-3 font-medium">Date</th>
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
                      <td className="py-3">{payment.enrollment?.course?.title ?? "—"}</td>
                      <td className="py-3 capitalize">{payment.method.replace(/_/g, " ").toLowerCase()}</td>
                      <td className="py-3 font-medium">{formatCurrency(Number(payment.totalAmount))}</td>
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
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
