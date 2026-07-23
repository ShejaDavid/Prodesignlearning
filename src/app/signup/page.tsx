import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { SignupForm } from "@/components/forms/signup-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata = {
  title: "Create Account",
  description: "Create a Prodesign Learning Centre account and wait for enrolment approval.",
};

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-muted/30 px-4 py-12">
      <div className="mx-auto grid w-full max-w-5xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="order-2 lg:order-1">
          <CardHeader className="text-center lg:text-left">
            <Link href="/" className="mb-2 inline-flex justify-center lg:justify-start">
              <Image
                src="/logo.png"
                alt="Prodesign Learning Centre"
                width={151}
                height={76}
                className="h-16 w-auto"
                priority
              />
            </Link>
            <CardTitle>Create Account</CardTitle>
            <CardDescription>
              Sign up to track your registration, payments, and course access.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense
              fallback={
                <p className="text-center text-sm text-muted-foreground">Loading...</p>
              }
            >
              <SignupForm />
            </Suspense>
          </CardContent>
        </Card>

        <Card className="order-1 lg:order-2">
          <CardHeader>
            <CardTitle>What happens next</CardTitle>
            <CardDescription>
              Creating an account does not unlock courses immediately.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <div className="rounded-xl bg-muted/50 p-4">
              <p className="font-medium text-foreground">1. Your account is created</p>
              <p className="mt-1">
                You can sign in right away and see your registration status.
              </p>
            </div>
            <div className="rounded-xl bg-muted/50 p-4">
              <p className="font-medium text-foreground">2. Our team reviews your enrolment</p>
              <p className="mt-1">
                We confirm your cohort, payment, and training details before giving
                course access.
              </p>
            </div>
            <div className="rounded-xl bg-muted/50 p-4">
              <p className="font-medium text-foreground">3. Access appears after approval</p>
              <p className="mt-1">
                Once enrolled, your courses and supporting materials show up in your
                dashboard automatically.
              </p>
            </div>
            <p>
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-secondary hover:underline">
                Sign in here
              </Link>
              .
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
