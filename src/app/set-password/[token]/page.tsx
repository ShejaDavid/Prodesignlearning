import Link from "next/link";
import { findValidPasswordSetToken } from "@/lib/tokens";
import { BrandLogo } from "@/components/brand/brand-logo";
import { SetPasswordForm } from "@/components/forms/set-password-form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

// Token validity is checked per request.
export const dynamic = "force-dynamic";

export default async function SetPasswordPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const valid = await findValidPasswordSetToken(token);

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mb-2 flex justify-center">
            <BrandLogo variant="auth" priority />
          </div>
          <CardTitle>{valid ? "Set Your Password" : "Link Expired"}</CardTitle>
          <CardDescription>
            {valid
              ? "Choose a password to activate your account and access your course."
              : "This activation link is invalid or has already been used."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {valid ? (
            <SetPasswordForm token={token} />
          ) : (
            <div className="space-y-4 text-center text-sm text-muted-foreground">
              <p>
                Please contact Prodesign Learning Centre to receive a new
                activation link.
              </p>
              <Link
                href="/login"
                className="text-secondary hover:underline font-medium"
              >
                Back to sign in
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
