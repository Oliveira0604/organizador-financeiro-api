import type { CreateIncomeData, IncomeRepository, UpdateIncomeData } from "../income-repository";
import { prisma } from "@/lib/prisma";

export class PrismaIncomeRepository implements IncomeRepository {
    async create(data: CreateIncomeData) {
        const income = await prisma.income.create({
            data: {
                title: data.title,
                amount: data.amount,

                user: {
                    connect: {
                        id: data.userId
                    },
                },

                category: {
                    connect: {
                        id: data.categoryId
                    }
                }
            },
        });

        return {
            ...income,
            amount: income.amount.toNumber()
        };
    }

    async findById(id: string) {
        const income = await prisma.income.findUnique({
            where: {
                id,
            }
        });

        if (!income) {
            return null;
        }

        return {
            ...income,
            amount: income?.amount.toNumber()
        };
    }

    async findManyByUserIdBetweenDates(userId: string, startDate: Date, endDate: Date, page: number) {
        const userIncomes = await prisma.income.findMany({
            where: {
                userId,
                receivedAt: {
                    gte: startDate,
                    lt: endDate
                },
                deletedAt: null
            },
            take: 20,
            skip: (page - 1) * 20,
            orderBy: {
                receivedAt: "asc"
            }
        });

        return userIncomes.map((income) => ({
            ...income,
            amount: income.amount.toNumber()
        }));
    }

    async findManyByCategoryId(userId: string, categoryId: string, startDate: Date, endDate: Date, page: number) {
        const categoryIncomes = await prisma.income.findMany({
            where: {
                userId,
                categoryId,
                receivedAt: {
                    gte: startDate,
                    lte: endDate
                },
                deletedAt: null
            },
            take: 20,
            skip: (page - 1) * 20,
            orderBy: {
                receivedAt: "asc"
            }
        });

        return categoryIncomes.map((income) => ({
            ...income,
            amount: income.amount.toNumber()
        }));
    }

    async getTotal(userId: string, startDate: Date, endDate: Date) {
        const totalIncome = await prisma.income.aggregate({
            where: {
                userId,
                receivedAt: {
                    gte: startDate,
                    lte: endDate
                }
            },
            _sum: {
                amount: true
            }
        });

        return totalIncome._sum.amount?.toNumber() ?? 0;
    }

    async getTotalByCategoryId(userId: string, categoryId: string, startDate: Date, endDate: Date) {
        const totalIncome = await prisma.income.aggregate({
            where: {
                userId,
                categoryId,
                receivedAt: {
                    gte: startDate,
                    lte: endDate
                },
            },
            _sum: {
                amount: true
            }
        });

        return totalIncome._sum.amount?.toNumber() ?? 0;
    }

    async getTotalByUserId(id: string, startDate: Date, endDate: Date) {
        const total = await prisma.income.aggregate({
            where: {
                id,
                receivedAt: {
                    gte: startDate,
                    lte: endDate
                }
            },
            _sum: {
                amount: true
            }
        });

        return total._sum.amount?.toNumber() ?? 0;
    }

    async update(id: string, data: UpdateIncomeData) {
        const income = await prisma.income.update({
            where: {
                id,
            },
            data
        });

        return {
            ...income,
            amount: income.amount.toNumber()
        };
    }

    async delete(id: string) {
        await prisma.income.update({
            where: {
                id,
            },
            data: {
                deletedAt: new Date()
            }
        });

    }
}