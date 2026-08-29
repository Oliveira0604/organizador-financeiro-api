import type { CreateIncomeData, IncomeRepository, UpdateIncomeData } from "../income-repository";
import { prisma } from "@/lib/prisma";
import { Decimal } from "@/generated/prisma/internal/prismaNamespace";

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

        return income;
    }

    async findById(id: string) {
        const income = await prisma.income.findUnique({
            where: {
                id,
            }
        });

        return income;
    }

    async findManyByUserIdBetweenDates(userId: string, startDate: Date, endDate: Date) {
        const userIncomes = await prisma.income.findMany({
            where: {
                userId,
                receivedAt: {
                    gte: startDate,
                    lt: endDate
                },
                deletedAt: null
            },

            orderBy: {
                receivedAt: "desc"
            }
        });

        return userIncomes;
    }

    async findManyByCategoryId(userId: string, categoryId: string, startDate: Date, endDate: Date) {
        const categoryIncomes = await prisma.income.findMany({
            where: {
                userId,
                categoryId,
                receivedAt: {
                    gte: startDate,
                    lte: endDate
                }
            },
        });

        return categoryIncomes;
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

        return totalIncome._sum.amount ?? new Decimal(0);
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

        return totalIncome._sum.amount ?? new Decimal(0);
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

        return total._sum.amount ?? new Decimal(0);
    }

    async update(id: string, userId: string, data: UpdateIncomeData) {
        const income = await prisma.income.update({
            where: {
                id,
                userId
            },
            data
        });

        return income;
    }

    async delete(id: string, userId: string) {
        await prisma.income.update({
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