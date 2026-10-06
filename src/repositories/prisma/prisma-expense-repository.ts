import type { CreateExpenseData, ExpenseRepository, UpdateExpenseData } from "../expense-repository";
import { prisma } from "@/lib/prisma";

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

        return {
            ...expense,
            amount: expense.amount.toNumber()
        };
    }

    async findById(id: string) {
        const expense = await prisma.expense.findUnique({
            where: {
                id,
                deletedAt: null
            }
        });

        if (!expense) {
            return null;
        }

        return {
            ...expense,
            amount: expense?.amount.toNumber()
        };
    }

    async findManyByUserIdBetweenDates(userId: string, startDate: Date, endDate: Date, page: number) {
        const dateExpenses = await prisma.expense.findMany({
            where: {
                userId,
                paidAt: {
                    gte: startDate,
                    lte: endDate
                },
                deletedAt: null
            },
            take: 20,
            skip: (page - 1) * 20,
            orderBy: {
                paidAt: "asc"
            }
        });

        return dateExpenses.map((expense) => ({
            ...expense,
            amount: expense.amount.toNumber()
        }));
    }

    async findManyByCategoryId(categoryId: string, startDate: Date, endDate: Date, page: number) {
        const expenses = await prisma.expense.findMany({
            where: {
                categoryId,
                paidAt: {
                    gte: startDate,
                    lte: endDate
                },
                deletedAt: null
            },
            take: 20,
            skip: (page - 1) * 20,
            orderBy: {
                paidAt: "asc"
            }
        });

        return expenses.map((expense) => ({
            ...expense,
            amount: expense.amount.toNumber()
        }));
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

        return totalByCategory._sum.amount?.toNumber() ?? 0;
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

        return total._sum.amount?.toNumber() ?? 0;
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

        return totalExpense._sum.amount?.toNumber() ?? 0;
    }

    async update(id: string, data: UpdateExpenseData) {
        const updatedExpense = await prisma.expense.update({
            where: {
                id,
            },
            data,
        });

        return {
            ...updatedExpense,
            amount: updatedExpense.amount.toNumber()

        };

    }

    async delete(id: string) {
        await prisma.expense.update({
            where: {
                id,
            },
            data: {
                deletedAt: new Date()
            }
        });
    }
}