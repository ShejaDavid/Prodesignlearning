"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { checkoutSchema, type CheckoutFormData } from "@/lib/validations";
import { OrderSummary } from "@/components/checkout/order-summary";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import { CreditCard, Loader2, Lock, Smartphone } from "lucide-react";

interface CheckoutFormProps {
  enrollmentId: string;
  courseTitle: string;
  cohortName: string;
  startDate: string;
  schedule: string;
  price: number;
  taxRate: number;
}

const PAYMENT_METHODS = [
  { id: "CREDIT_CARD" as const, label: "Credit Card", icon: CreditCard },
  { id: "DEBIT_CARD" as const, label: "Debit Card", icon: CreditCard },
  { id: "MIPS" as const, label: "MIPS Mobile", icon: Smartphone },
];

export function CheckoutForm({
  enrollmentId,
  courseTitle,
  cohortName,
  startDate,
  schedule,
  price,
  taxRate,
}: CheckoutFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      enrollmentId,
      paymentMethod: "CREDIT_CARD",
      cardNumber: "",
      expiryDate: "",
      cvc: "",
    },
  });

  const { register, watch, setValue, handleSubmit, formState: { errors } } = form;
  const paymentMethod = watch("paymentMethod");
  const showCardFields = paymentMethod === "CREDIT_CARD" || paymentMethod === "DEBIT_CARD";

  async function onSubmit(data: CheckoutFormData) {
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) {
        setError(result.error || "Payment failed");
        router.push(`/checkout/failed?enrollment=${enrollmentId}`);
        return;
      }

      if (result.paymentUrl) {
        window.location.href = result.paymentUrl;
        return;
      }

      if (process.env.NODE_ENV === "development" && result.paymentId) {
        const completeRes = await fetch("/api/payments/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentId: result.paymentId }),
        });
        if (completeRes.ok) {
          router.push(`/checkout/success?payment=${result.paymentId}`);
          return;
        }
      }

      router.push(`/checkout/success?payment=${result.paymentId}`);
    } catch {
      setError("Payment processing failed. Please try again.");
      router.push(`/checkout/failed?enrollment=${enrollmentId}`);
    } finally {
      setIsSubmitting(false);
    }
  }

  const total = price + price * taxRate;

  return (
    <div className="grid gap-8 lg:grid-cols-5">
      <div className="lg:col-span-3 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-3">
              {PAYMENT_METHODS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setValue("paymentMethod", id)}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-xl border p-4 transition-all",
                    paymentMethod === id
                      ? "border-secondary bg-secondary/10 text-secondary"
                      : "border-border hover:border-secondary/50"
                  )}
                >
                  <Icon className="h-6 w-6" />
                  <span className="text-sm font-medium">{label}</span>
                </button>
              ))}
            </div>

            {showCardFields && (
              <div className="space-y-4 pt-4 border-t border-border">
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    placeholder="4242 4242 4242 4242"
                    {...register("cardNumber")}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <Input id="expiryDate" placeholder="MM/YY" {...register("expiryDate")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvc">CVC</Label>
                    <Input id="cvc" placeholder="123" {...register("cvc")} />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === "MIPS" && (
              <div className="rounded-xl bg-muted p-4 text-sm text-muted-foreground">
                You will be redirected to MIPS to complete payment via mobile banking.
              </div>
            )}
          </CardContent>
        </Card>

        {error && (
          <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-600">{error}</div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <input type="hidden" {...register("enrollmentId")} />
          <input type="hidden" {...register("paymentMethod")} />
          <Button type="submit" variant="premium" size="lg" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Lock className="h-4 w-4" />
                Pay {formatCurrency(total)}
              </>
            )}
          </Button>
          {errors.paymentMethod && (
            <p className="text-sm text-red-500 mt-2">{errors.paymentMethod.message}</p>
          )}
        </form>
      </div>

      <div className="lg:col-span-2">
        <OrderSummary
          courseTitle={courseTitle}
          cohortName={cohortName}
          startDate={formatDate(startDate)}
          schedule={schedule}
          price={price}
          taxRate={taxRate}
        />
      </div>
    </div>
  );
}
