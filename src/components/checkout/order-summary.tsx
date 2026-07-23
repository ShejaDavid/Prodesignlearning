import { formatCurrency, calculateTax } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Clock, BookOpen } from "lucide-react";

interface OrderSummaryProps {
  courseTitle: string;
  cohortName: string;
  startDate: string;
  schedule: string;
  price: number;
  taxRate: number;
}

export function OrderSummary({
  courseTitle,
  cohortName,
  startDate,
  schedule,
  price,
  taxRate,
}: OrderSummaryProps) {
  const taxAmount = calculateTax(price, taxRate);
  const total = price + taxAmount;

  return (
    <Card className="sticky top-6">
      <CardHeader>
        <CardTitle className="text-lg">Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <BookOpen className="h-5 w-5 text-secondary mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold">{courseTitle}</p>
              <p className="text-sm text-muted-foreground">{cohortName}</p>
            </div>
          </div>
          <div className="flex items-start gap-3 text-sm text-muted-foreground">
            <Clock className="h-4 w-4 mt-0.5 shrink-0" />
            <div>
              <p>Starts {startDate}</p>
              <p>{schedule}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Course fee</span>
            <span>{formatCurrency(price)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">VAT ({(taxRate * 100).toFixed(0)}%)</span>
            <span>{formatCurrency(taxAmount)}</span>
          </div>
          <div className="flex justify-between font-semibold text-base pt-2 border-t border-border">
            <span>Total</span>
            <span className="text-secondary">{formatCurrency(total)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Shield className="h-4 w-4" />
          <span>Secure payment · Encrypted transaction</span>
        </div>
      </CardContent>
    </Card>
  );
}
