import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddResourceForm } from "@/components/admin/add-resource-form";
import { DeleteResourceButton } from "@/components/admin/delete-resource-button";
import { FileText } from "lucide-react";

export const metadata = { title: "Materials" };
export const dynamic = "force-dynamic";

export default async function AdminMaterialsPage() {
  const courses = await db.course.findMany({
    orderBy: { title: "asc" },
    include: { resources: { orderBy: { sortOrder: "asc" } } },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Materials</h1>
        <p className="text-muted-foreground mt-1">
          Add downloadable files (manuals, project files, etc.) to a course.
          Only students enrolled in that course can see or download them —
          same access rule as videos.
        </p>
      </div>

      {courses.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No courses yet. Create a course first.
        </p>
      )}

      {courses.map((course) => (
        <Card key={course.id}>
          <CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0">
            <CardTitle>{course.title}</CardTitle>
            <AddResourceForm courseId={course.id} />
          </CardHeader>
          <CardContent>
            {course.resources.length === 0 ? (
              <p className="text-sm text-muted-foreground">No materials yet.</p>
            ) : (
              <ul className="space-y-2">
                {course.resources.map((resource) => (
                  <li
                    key={resource.id}
                    className="flex items-center justify-between gap-3 rounded-lg bg-muted/40 px-3 py-2 text-sm"
                  >
                    <span className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-secondary" />
                      {resource.title}
                    </span>
                    <DeleteResourceButton
                      resourceId={resource.id}
                      title={resource.title}
                    />
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
