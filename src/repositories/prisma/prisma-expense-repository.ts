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
                deletedAt: null
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

    async findManyByCategoryId(categoryId: string, startDate: Date, endDate: Date) {
        const expenses = await prisma.expense.findMany({
            where: {
                categoryId,
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

        return expenses;
    }

    async getTotalByCategoryId(userId: string, categoryId: string, startDate: Date, endDate: Date) {
        const totalByCategory = await prisma.expense.aggregate({
            where: {
                userId,
                categoryId,
                paidAt: {
                    gte: startDate,
                    lte: endDate
                },
                deletedAt: null
            },
            _sum: {
                amount: true
            }
        });

        return totalByCategory._sum.amount ?? new Decimal(0);
    }

    async getTotalByUserId(userId: string, startDate: Date, endDate: Date) {
        const total = await prisma.expense.aggregate({
            where: {
                userId,
                paidAt: {
                    gte: startDate,
                    lte: endDate
                },
                deletedAt: null
            },
            _sum: {
                amount: true
            }
        });

        return total._sum.amount ?? new Decimal(0);
    }

    async getTotal(userId: string, startDate: Date, endDate: Date) {
        const totalExpense = await prisma.expense.aggregate({
            where: {
                userId,
                paidAt: {
                    gte: startDate,
                    lte: endDate
                },
                deletedAt: null
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
        await prisma.expense.update({
            where: {
                id,
                userId
            },
            data: {
                deletedAt: new Date()
            }
        });
    }
}