import { db } from "@/lib/db";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  EnrollStudentForm,
  type CohortOption,
} from "@/components/admin/enroll-student-form";

export const metadata = {
  title: "Enrol Student",
};

export const dynamic = "force-dynamic";

export default async function AdminEnrollPage({
  searchParams,
}: {
  searchParams: Promise<{
    email?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
  }>;
}) {
  const prefill = await searchParams;
  const courses = await db.course.findMany({
    where: { isActive: true },
    orderBy: { title: "asc" },
    include: { cohorts: { orderBy: { startDate: "asc" } } },
  });

  const cohorts: CohortOption[] = courses.flatMap((course) =>
    course.cohorts.map((cohort) => ({
      id: cohort.id,
      label: `${course.title} — ${cohort.name}`,
    }))
  );

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Enrol a Student</h1>
        <p className="mt-1 text-muted-foreground">
          Manually onboard a student after confirming their registration and
          payment. New students receive a set-password link to activate their
          account.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Student &amp; cohort</CardTitle>
        </CardHeader>
        <CardContent>
          {cohorts.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No cohorts available yet. Create a course and cohort first.
            </p>
          ) : (
            <EnrollStudentForm cohorts={cohorts} defaults={prefill} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
