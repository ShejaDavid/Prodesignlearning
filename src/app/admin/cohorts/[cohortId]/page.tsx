import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Users } from "lucide-react";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EnrollmentStatusSelect } from "@/components/admin/enrollment-status-select";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Cohort Roster" };
export const dynamic = "force-dynamic";

interface RosterRow {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  status: string;
  enrolledAt: string | null;
  accessExpiresAt: string | null;
}

export default async function CohortRosterPage({
  params,
}: {
  params: Promise<{ cohortId: string }>;
}) {
  const { cohortId } = await params;

  const cohort = await db.cohort.findUnique({
    where: { id: cohortId },
    include: {
      course: true,
      enrollments: {
        include: { user: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!cohort) notFound();

  const rows: RosterRow[] = cohort.enrollments.map((e) => ({
    id: e.id,
    name: `${e.user.firstName} ${e.user.lastName}`,
    email: e.user.email,
    phone: e.user.phone,
    status: e.status,
    enrolledAt: e.enrolledAt ? e.enrolledAt.toISOString() : null,
    accessExpiresAt: e.accessExpiresAt ? e.accessExpiresAt.toISOString() : null,
  }));

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/courses"
          className="mb-3 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Courses
        </Link>
        <h1 className="text-2xl font-bold">{cohort.name}</h1>
        <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-muted-foreground">
          <span>{cohort.course.title}</span>
          <span className="inline-flex items-center gap-1.5">
            <Users className="h-4 w-4" />
            {rows.length} enrolled · {cohort.seatsAvailable}/{cohort.seatsTotal} seats
            available
          </span>
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Roster</CardTitle>
        </CardHeader>
        <CardContent>
          {rows.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No students enrolled in this cohort yet.
            </p>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                      Student
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                      Phone
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                      Enrolled
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                      Access Until
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.id} className="border-b border-border last:border-0">
                      <td className="px-4 py-3">{row.name}</td>
                      <td className="px-4 py-3">{row.email}</td>
                      <td className="px-4 py-3">{row.phone ?? "—"}</td>
                      <td className="px-4 py-3">
                        <EnrollmentStatusSelect
                          enrollmentId={row.id}
                          status={row.status}
                          studentName={row.name}
                        />
                      </td>
                      <td className="px-4 py-3">
                        {row.enrolledAt ? formatDate(row.enrolledAt) : "—"}
                      </td>
                      <td className="px-4 py-3">
                        {row.accessExpiresAt ? formatDate(row.accessExpiresAt) : "No expiry"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
