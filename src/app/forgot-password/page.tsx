import { ForgotPasswordForm } from "@/components/forms/forgot-password-form";
import { BrandLogo } from "@/components/brand/brand-logo";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export const metadata = {
  title: "Reset Password",
};

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mb-2 flex justify-center">
            <BrandLogo variant="auth" priority />
          </div>
          <CardTitle>Reset Password</CardTitle>
          <CardDescription>
            Enter your email and we&apos;ll send you a link to reset your password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ForgotPasswordForm />
        </CardContent>
      </Card>
    </div>
  );
}
