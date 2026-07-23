"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useTheme } from "@/components/providers/theme-provider";
import { AnimatePresence, motion } from "framer-motion";
import {
  ExternalLink,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  ShieldCheck,
  Sun,
  X,
} from "lucide-react";
import { NAV_LINKS, SITE_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { UserMenu } from "@/components/layout/user-menu";

export function Header() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Not gated on `mounted`: the root layout seeds SessionProvider with the
  // real server-resolved session, so this is already correct on both the
  // server render and the first client render — no loading/mismatch window.
  const isAuthed = status === "authenticated" && session?.user;
  const isAdmin = isAuthed && (session.user as { role?: string }).role === "ADMIN";
  const dashboardHref = isAdmin ? "/admin" : "/dashboard";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-transparent transition-all duration-300",
        scrolled && "glass border-border/50 premium-shadow"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-16 items-center justify-center rounded-xl bg-white px-1 ring-1 ring-border/60">
            <Image
              src="/logo.png"
              alt="Prodesign Learning Centre"
              width={151}
              height={76}
              priority
              className="h-7 w-auto"
            />
          </span>
          <span className="text-lg font-bold tracking-tight text-foreground">
            Prodesign Learning Centre
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-xl px-3 py-2 text-sm font-medium transition-colors hover:bg-muted",
                pathname === link.href
                  ? "text-secondary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {resolvedTheme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          )}

          <Button variant="ghost" size="sm" asChild>
            <Link
              href={SITE_CONFIG.mainSiteUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Main Website
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </Button>

          {isAuthed ? (
            <UserMenu
              name={session.user.name ?? session.user.email ?? "Account"}
              email={session.user.email ?? ""}
              role={(session.user as { role?: string }).role ?? "STUDENT"}
            />
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Sign In</Link>
              </Button>

              <Button variant="premium" size="sm" asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {resolvedTheme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden border-t border-border/50 glass lg:hidden"
          >
            <nav className="flex flex-col gap-1 px-4 py-4">
              {NAV_LINKS.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    href={link.href}
                    className={cn(
                      "block rounded-xl px-4 py-3 text-sm font-medium transition-colors hover:bg-muted",
                      pathname === link.href
                        ? "bg-secondary/10 text-secondary"
                        : "text-foreground"
                    )}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: NAV_LINKS.length * 0.05 }}
                className="mt-2 flex flex-col gap-2 border-t border-border/50 pt-4"
              >
                <Button variant="outline" asChild>
                  <Link
                    href={SITE_CONFIG.mainSiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Main Website
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </Button>
                {isAuthed ? (
                  <>
                    <div className="flex items-center gap-3 rounded-xl bg-muted/50 px-4 py-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-white">
                        {(session.user.name ?? session.user.email ?? "?")
                          .trim()
                          .charAt(0)
                          .toUpperCase()}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                          {session.user.name ?? session.user.email}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {session.user.email}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" asChild>
                      <Link href={dashboardHref}>
                        {isAdmin ? (
                          <ShieldCheck className="h-4 w-4" />
                        ) : (
                          <LayoutDashboard className="h-4 w-4" />
                        )}
                        {isAdmin ? "Admin Panel" : "My Dashboard"}
                      </Link>
                    </Button>
                    <Button
                      variant="premium"
                      onClick={() => signOut({ callbackUrl: "/" })}
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" asChild>
                      <Link href="/login">Sign In</Link>
                    </Button>
                    <Button variant="premium" asChild>
                      <Link href="/signup">Sign Up</Link>
                    </Button>
                  </>
                )}
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
