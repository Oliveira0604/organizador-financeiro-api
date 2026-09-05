import { Decimal } from "@/generated/prisma/internal/prismaNamespace";

export function getPercentage(userTotal: Decimal, categoryTotal: Decimal): Decimal {
    if (userTotal.equals(0) || categoryTotal.equals(0)) {
        return new Decimal(0);
    }

    return categoryTotal.div(userTotal).mul(100).floor();
}