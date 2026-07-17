import type { Expense, Prisma } from "@/generated/prisma/client";

export interface ExpenseRepository {
    create(data: Prisma.ExpenseCreateInput): Promise<Expense>
    findById(id: string): Promise<Expense | null>
    getTotalByCategory(userId: string, category: string): Promise<Expense | null>
    increaseAmount(userId: string, amount: number): Promise<Expense>
    update(userId: string, data: Prisma.ExpenseUpdateInput): Promise<Expense>
    delete(userId: string, id: string): Promise<void>
}