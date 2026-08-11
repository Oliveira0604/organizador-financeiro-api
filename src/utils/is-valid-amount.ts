import type { Decimal } from "@/generated/prisma/internal/prismaNamespace";

export function isValidAmount(amount: Decimal): boolean {
    return amount.greaterThan(0);
}