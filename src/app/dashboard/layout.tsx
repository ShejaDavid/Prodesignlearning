import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { SessionProvider } from "@/components/providers/session-provider";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/dashboard");
  }

  return (
    <SessionProvider session={session}>
      <div className="flex min-h-screen">
        <DashboardSidebar userName={session.user.name ?? undefined} />
        <main className="flex-1 overflow-auto bg-muted/30 p-6 lg:p-8">{children}</main>
      </div>
    </SessionProvider>
  );
}
