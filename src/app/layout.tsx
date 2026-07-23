import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { SessionProvider } from "@/components/providers/session-provider";
import { auth } from "@/lib/auth";
import { SITE_CONFIG, SEO_KEYWORDS } from "@/lib/constants";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: `${SITE_CONFIG.name} | Autodesk Training Mauritius`,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  keywords: [...SEO_KEYWORDS],
  authors: [{ name: "Prodesign Mauritius" }],
  openGraph: {
    type: "website",
    locale: "en_MU",
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.fullName,
    title: `${SITE_CONFIG.name} | Autodesk Training Mauritius`,
    description: SITE_CONFIG.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_CONFIG.name} | Autodesk Training Mauritius`,
    description: SITE_CONFIG.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Resolved server-side and handed to SessionProvider so the client's
  // useSession() (used by the nav) starts with the real session already known
  // instead of starting blank and fetching /api/auth/session after mount —
  // that gap was showing "signed out" in the nav while server-rendered page
  // content (which reads the session directly) was still correctly signed in.
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <head>
        {/*
          Applies the saved theme before first paint, avoiding a flash of the
          wrong theme. Rendered directly by this Server Component (not a
          Client Component), so it executes once during HTML parsing and is
          never re-rendered by React — no type-toggle trick needed here.
          suppressHydrationWarning on <html> tells React to accept the class
          this script sets rather than flag it as a mismatch.
        */}
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(){try{if(localStorage.getItem("theme")==="dark")document.documentElement.classList.add("dark")}catch(e){}})()`,
          }}
        />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider>
          <SessionProvider session={session}>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <WhatsAppButton />
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
