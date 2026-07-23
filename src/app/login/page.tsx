import { Suspense } from "react";
import Image from "next/image";
import { LoginForm } from "@/components/forms/login-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ registered?: string; activated?: string }>;
}) {
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
          <CardTitle>Sign In</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<p className="text-sm text-muted-foreground text-center">Loading...</p>}>
            <LoginFormWrapper searchParams={searchParams} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}

async function LoginFormWrapper({
  searchParams,
}: {
  searchParams: Promise<{ registered?: string; activated?: string }>;
}) {
  const params = await searchParams;
  return (
    <>
      {params.activated === "1" && (
        <div className="mb-4 rounded-xl bg-green-50 border border-green-200 p-3 text-sm text-green-700">
          Account activated! Sign in with your new password to access your course.
        </div>
      )}
      {params.registered === "1" && (
        <div className="mb-4 rounded-xl bg-green-50 border border-green-200 p-3 text-sm text-green-700">
          Account created! Sign in below to track your registration while your
          enrolment is being reviewed.
        </div>
      )}
      <LoginForm />
    </>
  );
}
