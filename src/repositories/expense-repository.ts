import type { Decimal } from "@/generated/prisma/internal/prismaNamespace";

export type CreateExpenseData = {
    title: string,
    amount: Decimal,
    categoryId: string,
    userId: string,
}

export type UpdateExpenseData = {
    title?: string,
    amount?: Decimal,
    categoryId?: string
}

export type Expense = {
    id: string
    title: string,
    amount: Decimal,
    paidAt: Date,
    categoryId: string,
    userId: string,
    updatedAt: Date | null
    deletedAt: Date | null
}

export interface ExpenseRepository {
    create(data: CreateExpenseData): Promise<Expense>
    findById(id: string): Promise<Expense | null>
    findManyByCategoryId(categoryId: string, startDate: Date, endDate: Date): Promise<Expense[]>
    findManyByUserIdBetweenDates(userId: string, startDate: Date, endDate: Date): Promise<Expense[]>
    getTotal(userId: string, startDate: Date, endDate: Date): Promise<Decimal>
    getTotalByCategoryId(userId: string, categoryId: string, startDate: Date, endDate: Date): Promise<Decimal>
    getTotalByUserId(userId: string, startDate: Date, endDate: Date): Promise<Decimal>
    update(id: string, userId: string, data: UpdateExpenseData): Promise<Expense>
    delete(id: string, userId: string): Promise<void>
}
