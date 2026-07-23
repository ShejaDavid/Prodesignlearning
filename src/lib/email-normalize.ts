export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function emailEquals(email: string) {
  return {
    equals: normalizeEmail(email),
    mode: "insensitive" as const,
  };
}
