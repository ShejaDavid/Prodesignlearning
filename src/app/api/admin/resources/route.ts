import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { adminResourceSchema } from "@/lib/validations";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") return null;
  return session;
}

export async function POST(request: Request) {
  try {
    if (!(await requireAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const parsed = adminResourceSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid data" },
        { status: 400 }
      );
    }

    const { courseId, title, fileUrl } = parsed.data;

    const course = await db.course.findUnique({ where: { id: courseId } });
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const sortOrder = await db.resource.count({ where: { courseId } });

    const resource = await db.resource.create({
      data: { courseId, title, fileUrl, sortOrder },
    });

    return NextResponse.json({ success: true, resource });
  } catch (error) {
    console.error("Resources POST error:", error);
    return NextResponse.json({ error: "Failed to add resource" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    if (!(await requireAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const id = new URL(request.url).searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Missing resource id" }, { status: 400 });
    }

    const resource = await db.resource.findUnique({ where: { id } });
    if (!resource) {
      return NextResponse.json({ error: "Resource not found" }, { status: 404 });
    }

    await db.resource.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Resources DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete resource" }, { status: 500 });
  }
}
