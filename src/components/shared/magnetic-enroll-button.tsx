"use client";

import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type MagneticEnrollIcon = "arrow-right";

interface MagneticEnrollButtonProps {
  href: string;
  children: React.ReactNode;
  icon?: MagneticEnrollIcon;
  external?: boolean;
  size?: "default" | "lg";
  className?: string;
}

export function MagneticEnrollButton({
  href,
  children,
  icon,
  external = false,
  size = "default",
  className,
}: MagneticEnrollButtonProps) {
  const proximity = useMotionValue(0);
  const x = useSpring(0, { stiffness: 240, damping: 18, mass: 0.35 });
  const y = useSpring(0, { stiffness: 240, damping: 18, mass: 0.35 });
  const scale = useSpring(1, { stiffness: 280, damping: 16, mass: 0.35 });
  const glowOpacity = useTransform(proximity, [0, 1], [0.45, 1]);
  const glowScale = useTransform(proximity, [0, 1], [0.9, 1.2]);

  function reset() {
    proximity.set(0);
    x.set(0);
    y.set(0);
    scale.set(1);
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse") return;

    const rect = event.currentTarget.getBoundingClientRect();
    const dx = event.clientX - (rect.left + rect.width / 2);
    const dy = event.clientY - (rect.top + rect.height / 2);
    const distance = Math.hypot(dx, dy);
    const radius = Math.max(rect.width, rect.height) * 1.55;
    const strength = Math.max(0, 1 - distance / radius);

    proximity.set(strength);
    x.set(dx * strength * 0.26);
    y.set(dy * strength * 0.34);
    scale.set(1 + strength * 0.09);
  }

  return (
    <motion.div
      className={cn("magnetic-enroll-wrap inline-flex", className)}
      onPointerMove={handlePointerMove}
      onPointerLeave={reset}
      whileTap={{ scale: 0.96 }}
      style={{ x, y, scale }}
    >
      <motion.span
        aria-hidden="true"
        className="magnetic-enroll-glow"
        style={{ opacity: glowOpacity, scale: glowScale }}
      />
      <Button variant="premium" size={size} className="enroll-cta" asChild>
        <Link
          href={href}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
        >
          {children}
          {icon === "arrow-right" && (
            <ArrowRight className={size === "lg" ? "h-5 w-5" : "h-4 w-4"} />
          )}
        </Link>
      </Button>
    </motion.div>
  );
}
