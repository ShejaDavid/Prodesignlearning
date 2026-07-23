import Link from "next/link";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface FailedPageProps {
  searchParams: Promise<{ enrollment?: string }>;
}

export default async function CheckoutFailedPage({ searchParams }: FailedPageProps) {
  const { enrollment } = await searchParams;

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center px-4">
      <Card className="max-w-lg w-full text-center">
        <CardContent className="pt-10 pb-8 space-y-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
            <XCircle className="h-8 w-8 text-red-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Payment Failed</h1>
            <p className="mt-2 text-muted-foreground">
              We couldn&apos;t process your payment. Please check your payment details and try again.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild variant="premium">
              <Link href={enrollment ? `/checkout?enrollment=${enrollment}` : "/checkout"}>
                Try Again
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/contact">Contact Support</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
