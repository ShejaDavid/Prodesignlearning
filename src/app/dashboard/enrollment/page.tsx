import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { MOCK_ENROLLMENT } from "@/lib/course-data";
import { EXTERNAL_REGISTRATION_URL } from "@/lib/constants";
import Link from "next/link";

async function getEnrollment(userId: string) {
  try {
    return await db.enrollment.findFirst({
      where: { userId },
      include: { course: true, cohort: true, payment: true, certificate: true },
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return {
      id: MOCK_ENROLLMENT.id,
      status: MOCK_ENROLLMENT.status,
      enrolledAt: null,
      completedAt: null,
      course: MOCK_ENROLLMENT.course,
      cohort: {
        ...MOCK_ENROLLMENT.cohort,
        startDate: new Date(MOCK_ENROLLMENT.cohort.startDate),
      },
      payment: null,
      certificate: null,
    };
  }
}

export default async function EnrollmentPage() {
  const session = await auth();
  const enrollment = await getEnrollment(session!.user!.id);

  if (!enrollment) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Enrollment</h1>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">You don&apos;t have an active enrollment.</p>
            <Button asChild className="mt-4" variant="premium">
              <Link href={EXTERNAL_REGISTRATION_URL} target="_blank" rel="noopener noreferrer">
                Register for a Course
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Enrollment Details</h1>

      <Card>
        <CardHeader>
          <CardTitle>{enrollment.course.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-6 text-sm">
            <div>
              <p className="text-muted-foreground">Status</p>
              <p className="font-medium capitalize">{enrollment.status.replace(/_/g, " ").toLowerCase()}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Cohort</p>
              <p className="font-medium">{enrollment.cohort.name}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Start Date</p>
              <p className="font-medium">{formatDate(enrollment.cohort.startDate)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Schedule</p>
              <p className="font-medium">{enrollment.cohort.schedule}</p>
            </div>
            {enrollment.enrolledAt && (
              <div>
                <p className="text-muted-foreground">Enrolled On</p>
                <p className="font-medium">{formatDate(enrollment.enrolledAt)}</p>
              </div>
            )}
          </div>

          {enrollment.status === "PAYMENT_PENDING" && (
            <Button asChild variant="premium">
              <Link href={`/checkout?enrollment=${enrollment.id}`}>Complete Payment</Link>
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
