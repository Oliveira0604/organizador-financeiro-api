import type { Decimal } from "@/generated/prisma/internal/prismaNamespace";

export type CreateIncomeData = {
    title: string,
    amount: Decimal,
    categoryId: string,
    userId: string,
}

export type UpdateIncomeData = {
    title?: string,
    amount?: Decimal,
    receivedAt?: Date
}

export type Income = {
    id: string,
    title: string,
    amount: Decimal,
    receivedAt: Date,
    categoryId: string,
    userId: string,
    updatedAt: Date | null,
    deletedAt: Date | null
}

export interface IncomeRepository {
    create(data: CreateIncomeData): Promise<Income>
    findById(id: string): Promise<Income | null>
    findManyByUserIdBetweenDates(userId: string, startDate: Date, endDate: Date): Promise<Income[]>
    findManyByCategoryId(userId: string, categoryId: string, startDate: Date, endDate: Date): Promise<Income[]>
    getTotal(userId: string, startDate: Date, endDate: Date): Promise<Decimal>
    getTotalByCategoryId(userId: string, categoryId: string, startDate: Date, endDate: Date): Promise<Decimal>
    getTotalByUserId(userId: string, startDate: Date, endDate: Date): Promise<Decimal>
    update(id: string, data: UpdateIncomeData): Promise<Income>
    delete(id: string, userId: string): Promise<void>
}
