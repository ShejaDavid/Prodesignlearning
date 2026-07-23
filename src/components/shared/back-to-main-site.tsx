import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BackToMainSiteProps {
  variant?: "default" | "outline" | "ghost" | "link";
  size?: "default" | "sm" | "lg";
  className?: string;
  showIcon?: boolean;
}

export function BackToMainSite({
  variant = "outline",
  size = "default",
  className,
  showIcon = true,
}: BackToMainSiteProps) {
  return (
    <Button variant={variant} size={size} className={cn(className)} asChild>
      <Link
        href={SITE_CONFIG.mainSiteUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        Back to Prodesign.mu
        {showIcon && <ExternalLink className="h-4 w-4" />}
      </Link>
    </Button>
  );
}
