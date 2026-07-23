import Link from "next/link";
import { CheckCircle2, XCircle } from "lucide-react";
import { verifyEmailToken } from "@/lib/tokens";
import { BrandLogo } from "@/components/brand/brand-logo";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Verification runs once per visit, so this can never be statically cached.
export const dynamic = "force-dynamic";

export default async function VerifyEmailPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const verified = await verifyEmailToken(token);

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mb-2 flex justify-center">
            <BrandLogo variant="auth" priority />
          </div>
          {verified ? (
            <CheckCircle2 className="mx-auto h-10 w-10 text-success" />
          ) : (
            <XCircle className="mx-auto h-10 w-10 text-muted-foreground/50" />
          )}
          <CardTitle>{verified ? "Email Confirmed" : "Link Expired"}</CardTitle>
          <CardDescription>
            {verified
              ? "Thanks — your email address is confirmed."
              : "This confirmation link is invalid or has already been used. Your account still works either way — this step is optional."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full">
            <Link href="/login">Back to sign in</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
