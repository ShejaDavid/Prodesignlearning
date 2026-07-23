import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

async function getProfile(userId: string) {
  try {
    return await db.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });
  } catch {
    return null;
  }
}

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/dashboard/profile");
  const user = await getProfile(session.user.id);

  const displayUser = user ?? {
    firstName: session?.user?.name?.split(" ")[0] ?? "Student",
    lastName: session?.user?.name?.split(" ").slice(1).join(" ") ?? "",
    email: session?.user?.email ?? "",
    phone: null,
    dateOfBirth: null,
    profile: {
      occupation: "Architecture Student",
      company: null,
      experienceLevel: "BEGINNER" as const,
    },
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Profile</h1>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <p className="text-muted-foreground">Full Name</p>
              <p className="font-medium">{displayUser.firstName} {displayUser.lastName}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Email</p>
              <p className="font-medium">{displayUser.email}</p>
            </div>
            {displayUser.phone && (
              <div>
                <p className="text-muted-foreground">Phone</p>
                <p className="font-medium">{displayUser.phone}</p>
              </div>
            )}
            {displayUser.dateOfBirth && (
              <div>
                <p className="text-muted-foreground">Date of Birth</p>
                <p className="font-medium">{formatDate(displayUser.dateOfBirth)}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {displayUser.profile && (
          <Card>
            <CardHeader>
              <CardTitle>Professional Background</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              {displayUser.profile.occupation && (
                <div>
                  <p className="text-muted-foreground">Occupation</p>
                  <p className="font-medium">{displayUser.profile.occupation}</p>
                </div>
              )}
              {displayUser.profile.company && (
                <div>
                  <p className="text-muted-foreground">Company</p>
                  <p className="font-medium">{displayUser.profile.company}</p>
                </div>
              )}
              <div>
                <p className="text-muted-foreground">Experience Level</p>
                <p className="font-medium capitalize">
                  {displayUser.profile.experienceLevel.toLowerCase()}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
