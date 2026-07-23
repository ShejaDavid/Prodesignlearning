import { PrismaClient, Prisma } from "@prisma/client";

const OCCUPIED_STATUSES = [
  "PENDING",
  "PAYMENT_PENDING",
  "ENROLLED",
  "COMPLETED",
] as const;

type PrismaLike = PrismaClient | Prisma.TransactionClient;

export async function syncCohortSeats(
  db: PrismaLike,
  cohortId: string
) {
  const [cohort, occupied] = await Promise.all([
    db.cohort.findUnique({
      where: { id: cohortId },
      select: { seatsTotal: true },
    }),
    db.enrollment.count({
      where: {
        cohortId,
        status: { in: [...OCCUPIED_STATUSES] },
      },
    }),
  ]);

  if (!cohort) return null;

  return db.cohort.update({
    where: { id: cohortId },
    data: {
      seatsAvailable: Math.max(cohort.seatsTotal - occupied, 0),
    },
  });
}
