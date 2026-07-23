import Link from "next/link";
import { BookOpen, ArrowRight, Clock } from "lucide-react";
import { auth } from "@/lib/auth";
import { getMyCourses } from "@/lib/enrollments";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

export const metadata = {
  title: "My Courses",
};

export const dynamic = "force-dynamic";

export default async function MyCoursesPage() {
  const session = await auth();
  const enrollments = await getMyCourses(session!.user!.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Courses</h1>
        <p className="mt-1 text-muted-foreground">
          Courses you can access through an active enrolment
        </p>
      </div>

      {enrollments.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-14 text-center">
            <BookOpen className="h-10 w-10 text-muted-foreground/50" />
            <div>
              <p className="font-medium">No active courses yet</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Once you enrol in a cohort and your place is confirmed, the course
                appears here.
              </p>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/courses">Browse courses</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {enrollments.map((enrollment) => (
            <Card key={enrollment.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="text-lg">{enrollment.course.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{enrollment.cohort.name}</p>
              </CardHeader>
              <CardContent className="mt-auto flex items-end justify-between gap-4">
                <div className="text-sm text-muted-foreground">
                  {enrollment.accessExpiresAt ? (
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      Access until {formatDate(enrollment.accessExpiresAt)}
                    </span>
                  ) : (
                    <span>Full access</span>
                  )}
                </div>
                <Button asChild size="sm">
                  <Link href={`/dashboard/courses/${enrollment.course.slug}`}>
                    Open course
                    <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
