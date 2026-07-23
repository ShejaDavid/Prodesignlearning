import Image from "next/image";
import Link from "next/link";
import { ForgotPasswordForm } from "@/components/forms/forgot-password-form";
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
          <Link href="/" className="mb-2 inline-flex justify-center">
            <Image
              src="/logo.png"
              alt="Prodesign Learning Centre"
              width={151}
              height={76}
              className="h-16 w-auto"
              priority
            />
          </Link>
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
