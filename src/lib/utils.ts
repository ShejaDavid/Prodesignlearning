import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = "MUR"): string {
  return new Intl.NumberFormat("en-MU", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-MU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

export function formatDuration(hours: number, days: number): string {
  if (!hours) return "Duration TBA";
  const hoursLabel = `${hours} Hour${hours === 1 ? "" : "s"}`;
  const daysLabel = `${days} Day${days === 1 ? "" : "s"}`;
  return `${hoursLabel} · ${daysLabel}`;
}

export function generateInvoiceNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `PD-${year}-${random}`;
}

export function generateCertificateNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const random = Math.floor(Math.random() * 100000)
    .toString()
    .padStart(5, "0");
  return `CERT-${year}-${random}`;
}

export function calculateTax(amount: number, taxRate: number): number {
  return Math.round(amount * taxRate * 100) / 100;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
