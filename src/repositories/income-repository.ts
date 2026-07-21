import type { Prisma, Income } from "@/generated/prisma/client";
import type { Decimal } from "@/generated/prisma/internal/prismaNamespace";

export interface IncomeRepository {
    create(data: Prisma.IncomeCreateInput): Promise<Income>
    findById(id: string): Promise<Income | null>
    findManyByUserIdAndDate(userId: string, startDate: Date, endDate: Date): Promise<Income[]>
    getTotalByCategory(userId: string, category: string, startDate: Date, endDate: Date): Promise<Decimal>
    update(userId: string, id: string, data: Prisma.IncomeUpdateInput): Promise<Income>
    delete(userId: string, id: string): Promise<void>
}