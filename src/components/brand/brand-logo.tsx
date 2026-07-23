import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type BrandLogoVariant = "header" | "footer" | "auth" | "checkout";

const VARIANT_STYLES: Record<
  BrandLogoVariant,
  { frame: string; image: string; size: { width: number; height: number } }
> = {
  header: {
    frame:
      "rounded-2xl bg-white px-3 py-2 ring-1 ring-border/60 shadow-sm transition-shadow hover:shadow-md",
    image: "h-8 sm:h-9 w-auto",
    size: { width: 378, height: 190 },
  },
  footer: {
    frame: "rounded-2xl bg-white px-3 py-2 ring-1 ring-white/10",
    image: "h-14 w-auto",
    size: { width: 378, height: 190 },
  },
  auth: {
    frame: "rounded-2xl bg-white px-3 py-2 ring-1 ring-border/60 shadow-sm",
    image: "h-16 w-auto",
    size: { width: 378, height: 190 },
  },
  checkout: {
    frame: "rounded-2xl bg-white px-3 py-2 ring-1 ring-border/60 shadow-sm",
    image: "h-12 w-auto",
    size: { width: 378, height: 190 },
  },
};

interface BrandLogoProps {
  variant?: BrandLogoVariant;
  href?: string;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
}

export function BrandLogo({
  variant = "header",
  href = "/",
  className,
  imageClassName,
  priority = false,
}: BrandLogoProps) {
  const styles = VARIANT_STYLES[variant];

  return (
    <Link
      href={href}
      className={cn("inline-flex items-center", styles.frame, className)}
      aria-label="Prodesign Learning Centre home"
    >
      <Image
        src="/logo.png"
        alt="Prodesign Learning Centre"
        width={styles.size.width}
        height={styles.size.height}
        priority={priority}
        className={cn(styles.image, imageClassName)}
      />
    </Link>
  );
}
