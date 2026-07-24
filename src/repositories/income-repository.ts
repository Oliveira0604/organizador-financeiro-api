import type { Income } from "@/generated/prisma/client";
import type { Decimal } from "@/generated/prisma/internal/prismaNamespace";

export type CreateIncomeData = {
    title: string,
    amount: Decimal,
    receivedAt: Date,
    categoryId: string,
    userId: string,
    updatedAt: Date
}

export type UpdateIncomeData = {
    title?: string,
    amount?: string,
}

export interface IncomeRepository {
    create(data: CreateIncomeData): Promise<Income>
    findById(id: string): Promise<Income | null>
    findManyByUserIdBetweenDates(userId: string, startDate: Date, endDate: Date): Promise<Income[]>
    getTotalByCategory(userId: string, categoryId: string, startDate: Date, endDate: Date): Promise<Decimal>
    update(userId: string, id: string, data: UpdateIncomeData): Promise<Income>
    delete(userId: string, id: string): Promise<void>
}