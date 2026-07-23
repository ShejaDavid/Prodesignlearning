import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatusCardProps {
  title: string;
  value: string;
  description?: string;
  icon: LucideIcon;
  variant?: "default" | "success" | "warning" | "info";
}

const variantStyles = {
  default: "bg-secondary/10 text-secondary",
  success: "bg-success/10 text-success",
  warning: "bg-amber-50 text-amber-600",
  info: "bg-accent/10 text-accent",
};

export function StatusCard({
  title,
  value,
  description,
  icon: Icon,
  variant = "default",
}: StatusCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 premium-shadow">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
        <div className={cn("rounded-xl p-3", variantStyles[variant])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
