import Link from "next/link";
import { redirect } from "next/navigation";
import { Award, Download, FileBadge2, GraduationCap, ShieldCheck } from "lucide-react";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

export const metadata = {
  title: "Certificates",
};

export const dynamic = "force-dynamic";

async function getCertificateData(userId: string) {
  const [certificates, completedEnrollments] = await Promise.all([
    db.certificate.findMany({
      where: { userId },
      include: {
        course: { select: { title: true } },
        enrollment: {
          include: {
            cohort: { select: { name: true } },
          },
        },
      },
      orderBy: { issuedAt: "desc" },
    }),
    db.enrollment.findMany({
      where: {
        userId,
        status: "COMPLETED",
        certificate: null,
      },
      include: {
        course: { select: { title: true } },
        cohort: { select: { name: true } },
      },
      orderBy: { completedAt: "desc" },
    }),
  ]);

  return { certificates, completedEnrollments };
}

export default async function CertificatesPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/dashboard/certificates");

  const { certificates, completedEnrollments } = await getCertificateData(
    session.user.id
  );

  const hasAnyCertificateState =
    certificates.length > 0 || completedEnrollments.length > 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Certificates</h1>
        <p className="mt-1 text-muted-foreground">
          Track issued certificates, verification details, and download availability.
        </p>
      </div>

      {!hasAnyCertificateState ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-14 text-center">
            <Award className="h-10 w-10 text-muted-foreground/50" />
            <div>
              <p className="font-medium">No certificates yet</p>
              <p className="mt-1 max-w-lg text-sm text-muted-foreground">
                Certificates appear here after you successfully complete a course and
                the training team issues your certificate record.
              </p>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/dashboard/courses">View My Courses</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {certificates.length > 0 && (
            <div className="grid gap-4 lg:grid-cols-2">
              {certificates.map((certificate) => (
                <Card key={certificate.id} className="overflow-hidden">
                  <div className="border-b border-border bg-muted/30 px-6 py-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-secondary">
                          Certificate Issued
                        </p>
                        <h2 className="mt-1 text-lg font-semibold">
                          {certificate.course.title}
                        </h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {certificate.enrollment.cohort.name}
                        </p>
                      </div>
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary/10">
                        <ShieldCheck className="h-5 w-5 text-secondary" />
                      </div>
                    </div>
                  </div>

                  <CardContent className="space-y-5 p-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-xs uppercase tracking-wider text-muted-foreground">
                          Certificate Number
                        </p>
                        <p className="mt-1 font-mono text-sm font-medium">
                          {certificate.certificateNumber}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wider text-muted-foreground">
                          Issued On
                        </p>
                        <p className="mt-1 text-sm font-medium">
                          {formatDate(certificate.issuedAt)}
                        </p>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-border bg-muted/20 p-4">
                      <p className="text-xs uppercase tracking-wider text-muted-foreground">
                        Download Status
                      </p>
                      {certificate.pdfUrl ? (
                        <div className="mt-3 flex items-center justify-between gap-3">
                          <p className="text-sm text-foreground">
                            Your certificate PDF is ready.
                          </p>
                          <Button asChild size="sm">
                            <a
                              href={certificate.pdfUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Download
                              <Download className="ml-1.5 h-4 w-4" />
                            </a>
                          </Button>
                        </div>
                      ) : (
                        <div className="mt-3 flex items-start gap-3">
                          <FileBadge2 className="mt-0.5 h-4 w-4 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">
                            Your certificate has been issued, but the downloadable PDF
                            has not been uploaded yet.
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {completedEnrollments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Awaiting Certificate Issue</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {completedEnrollments.map((enrollment) => (
                  <div
                    key={enrollment.id}
                    className="flex flex-col gap-2 rounded-2xl border border-border bg-muted/20 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-medium">{enrollment.course.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {enrollment.cohort.name}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <GraduationCap className="h-4 w-4" />
                      Completed{" "}
                      {enrollment.completedAt
                        ? formatDate(enrollment.completedAt)
                        : "recently"}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
