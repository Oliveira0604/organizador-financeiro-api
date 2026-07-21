import type { Expense, Prisma } from "@/generated/prisma/client";
import type { Decimal } from "@/generated/prisma/internal/prismaNamespace";

export interface ExpenseRepository {
    create(data: Prisma.ExpenseCreateInput): Promise<Expense>
    findById(id: string): Promise<Expense | null>
    findManyByUserIdAndDate(userId: string, startDate: Date, endDate: Date): Promise<Expense[]>
    getTotalByCategory(userId: string, categoryId: string): Promise<Decimal>
    update(userId: string, id: string, data: Prisma.ExpenseUpdateInput): Promise<Expense | null>
    delete(userId: string, id: string): Promise<void>
}