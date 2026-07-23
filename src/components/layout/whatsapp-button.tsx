"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface WhatsAppButtonProps {
  message?: string;
  className?: string;
}

export function WhatsAppButton({
  message = "Hi, I'm interested in Prodesign Learning Centre training.",
  className,
}: WhatsAppButtonProps) {
  const phone = SITE_CONFIG.whatsapp.replace(/\D/g, "");
  const href = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className={cn(
        "fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/30 transition-transform hover:scale-105 hover:shadow-xl hover:shadow-[#25D366]/40",
        className
      )}
    >
      <MessageCircle className="h-7 w-7 fill-current" />
    </Link>
  );
}
