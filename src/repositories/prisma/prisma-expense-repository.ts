import type { Prisma } from "@/generated/prisma/client";
import type { ExpenseRepository } from "../expense-repository";
import { prisma } from "@/lib/prisma";
import { Decimal } from "@/generated/prisma/internal/prismaNamespace";

export class PrismaExpenseRepository implements ExpenseRepository {
    async create(data: Prisma.ExpenseCreateInput) {
        const expense = await prisma.expense.create({
            data,
        });

        return expense;
    }

    async findById(id: string) {
        const expense = await prisma.expense.findUnique({
            where: {
                id,
            }
        });

        return expense;
    }

    async findManyByUserIdAndDate(userId: string, startDate: Date, endDate: Date) {
        const dateExpenses = await prisma.expense.findMany({
            where: {
                userId,
                paidAt: {
                    gte: startDate,
                    lt: endDate
                }
            },

            orderBy: {
                paidAt: "desc"
            }
        });

        return dateExpenses;
    }

    async getTotalByCategory(userId: string, categoryId: string) {
        const totalExpense = await prisma.expense.aggregate({
            where: {
                userId,
                categoryId
            },
            _sum: {
                amount: true
            }
        });

        return totalExpense._sum.amount ?? new Decimal(0);
    }

    async update(userId: string, id: string, data: Prisma.ExpenseUpdateInput) {
        const expense = await prisma.expense.findUnique({
            where: {
                id,
            }
        });

        if (!expense) {
            throw new ResourceNotFoundError();
        }

        if (expense.userId !== userId) {
            throw new NotAllowedError();
        }

        const updatedExpense = await prisma.expense.update({
            where: {
                id,
            },
            data,
        });

        return updatedExpense;

    }

    async delete(userId: string, id: string) {
        const expense = await prisma.expense.findUnique({
            where: {
                id,
            }
        });

        if (!expense) {
            throw new ResourceNotFoundError();
        }

        if (expense.userId !== userId) {
            throw new NotAllowedError();
        }


        await prisma.expense.delete({
            where: {
                id,
            }
        });
    }
}