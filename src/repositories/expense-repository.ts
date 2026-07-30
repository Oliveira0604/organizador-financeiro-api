import type { Decimal } from "@/generated/prisma/internal/prismaNamespace";

export type CreateExpenseData = {
    title: string,
    amount: Decimal,
    paidAt: Date,
    categoryId: string,
    userId: string,
}

export type UpdateExpenseData = {
    title?: string,
    amount?: Decimal,
}

export type Expense = {
    id: string
    title: string,
    amount: Decimal,
    paidAt: Date,
    categoryId: string,
    userId: string,
    updatedAt: Date | null
}

export interface ExpenseRepository {
    create(data: CreateExpenseData): Promise<Expense>
    findById(id: string): Promise<Expense | null>
    findManyByUserIdBetweenDates(userId: string, startDate: Date, endDate: Date): Promise<Expense[]>
    getTotalByCategory(userId: string, categoryId: string): Promise<Decimal>
    update(id: string, data: UpdateExpenseData): Promise<Expense | null>
    delete(id: string): Promise<void>
}