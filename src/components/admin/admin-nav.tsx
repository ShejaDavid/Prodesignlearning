"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  BookOpen,
  PlayCircle,
  CreditCard,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Defined here (inside the Client Component) rather than passed as a prop
// from the server layout: Lucide icons are component references, and React
// Server Components cannot serialize functions across the server/client
// boundary — passing them as props crashes the render.
const ADMIN_NAV = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/enroll", label: "Enrol Student", icon: UserPlus },
  { href: "/admin/students", label: "Students", icon: Users },
  { href: "/admin/courses", label: "Courses", icon: BookOpen },
  { href: "/admin/videos", label: "Videos", icon: PlayCircle },
  { href: "/admin/payments", label: "Payments", icon: CreditCard },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex-1 space-y-0.5 p-3">
      {ADMIN_NAV.map(({ href, label, icon: Icon }) => {
        const isActive =
          href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 rounded-lg border-l-2 border-transparent px-3 py-2.5 text-sm font-medium transition-colors",
              isActive
                ? "border-secondary bg-white/10 text-white"
                : "text-slate-400 hover:bg-white/5 hover:text-slate-100"
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
