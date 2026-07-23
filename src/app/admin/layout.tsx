import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { ArrowLeft } from "lucide-react";
import { AdminNav } from "@/components/admin/admin-nav";
import { UserMenu } from "@/components/layout/user-menu";
import { ToastProvider } from "@/components/providers/toast-provider";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/admin");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return (
    <ToastProvider>
      <div className="flex min-h-screen bg-muted/30">
        <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col bg-slate-900 text-slate-200">
          <div className="border-b border-white/10 px-5 py-5">
            <Link href="/admin" className="text-base font-bold tracking-tight text-white">
              Prodesign Admin
            </Link>
            <p className="mt-0.5 text-xs text-slate-400">Learning Centre Console</p>
          </div>

          <AdminNav />

          <div className="border-t border-white/10 p-3">
            <Link
              href="/"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:bg-white/5 hover:text-slate-100"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Site
            </Link>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-background px-6">
            <p className="text-sm font-semibold text-foreground">Admin Console</p>
            <UserMenu
              name={session.user.name ?? session.user.email ?? "Admin"}
              email={session.user.email ?? ""}
              role="ADMIN"
            />
          </header>
          <main className="flex-1 overflow-auto p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </ToastProvider>
  );
}
