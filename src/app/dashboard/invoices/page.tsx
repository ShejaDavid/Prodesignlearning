import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/utils";
import { FileText } from "lucide-react";

async function getInvoices(userId: string) {
  try {
    return await db.invoice.findMany({
      where: { userId },
      include: { payment: { include: { enrollment: { include: { course: true } } } } },
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return [];
  }
}

export default async function InvoicesPage() {
  const session = await auth();
  const invoices = await getInvoices(session!.user!.id);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Invoices</h1>

      <Card>
        <CardHeader>
          <CardTitle>Your Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          {invoices.length === 0 ? (
            <div className="py-12 text-center">
              <FileText className="mx-auto h-10 w-10 text-muted-foreground/50" />
              <p className="mt-3 text-muted-foreground text-sm">No invoices yet</p>
              <p className="text-xs text-muted-foreground mt-1">
                Invoices are generated after successful payment
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {invoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between rounded-xl border border-border p-4"
                >
                  <div>
                    <p className="font-medium">{invoice.invoiceNumber}</p>
                    <p className="text-sm text-muted-foreground">
                      {invoice.payment?.enrollment?.course?.title ?? "Course payment"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Issued {invoice.issuedAt ? formatDate(invoice.issuedAt) : "—"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatCurrency(Number(invoice.totalAmount))}</p>
                    <span className="rounded-full bg-success/10 text-success px-2.5 py-0.5 text-xs font-medium">
                      {invoice.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
