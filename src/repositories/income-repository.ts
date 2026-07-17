import type { Prisma, Income } from "@/generated/prisma/client";

export interface IncomeRepository {
    create(data: Prisma.IncomeCreateInput): Promise<Income>
    findById(id: string): Promise<Income | null>
    increaseAmout(userId: string, amount: number): Promise<Income>
    getTotalByCategory(userId: string, category: string): Promise<Income | null>
    update(userId: string, data: Prisma.IncomeUpdateInput): Promise<Income>
    delete(userId: string, id: string): Promise<void>
}