import type { CreateExpenseData, ExpenseRepository, UpdateExpenseData } from "../expense-repository";
import { prisma } from "@/lib/prisma";
import { Decimal } from "@/generated/prisma/internal/prismaNamespace";

export class PrismaExpenseRepository implements ExpenseRepository {
    async create(data: CreateExpenseData) {
        const expense = await prisma.expense.create({
            data: {
                title: data.title,
                amount: data.amount,
                userId: data.userId,
                categoryId: data.categoryId
            }
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

    async findManyByUserIdBetweenDates(userId: string, startDate: Date, endDate: Date) {
        const dateExpenses = await prisma.expense.findMany({
            where: {
                userId,
                paidAt: {
                    gte: startDate,
                    lte: endDate
                },
                deletedAt: null
            },

            orderBy: {
                paidAt: "desc"
            }
        });

        return dateExpenses;
    }

    async findManyByCategoryId(categoryId: string) {
        const expenses = await prisma.expense.findMany({
            where: {
                categoryId,
            }
        });

        return expenses;
    }

    async getTotalByCategoryId(userId: string, categoryId: string) {
        const totalByCategory = await prisma.expense.aggregate({
            where: {
                userId,
                categoryId
            },
            _sum: {
                amount: true
            }
        });

        return totalByCategory._sum.amount ?? new Decimal(0);
    }

    async getTotal(userId: string, startDate: Date, endDate: Date) {
        const totalExpense = await prisma.expense.aggregate({
            where: {
                userId,
                paidAt: {
                    gte: startDate,
                    lte: endDate
                }
            },
            _sum: {
                amount: true
            }

        });

        return totalExpense._sum.amount ?? new Decimal(0);
    }

    async update(id: string, userId: string, data: UpdateExpenseData) {
        const updatedExpense = await prisma.expense.update({
            where: {
                id,
                userId
            },
            data,
        });

        return updatedExpense;

    }

    async delete(id: string, userId: string) {
        await prisma.expense.delete({
            where: {
                id,
                userId
            }
        });
    }
}