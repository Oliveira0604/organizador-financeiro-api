import type { CreateIncomeData, IncomeRepository, UpdateIncomeData } from "../income-repository";
import { prisma } from "@/lib/prisma";
import { Decimal } from "@/generated/prisma/internal/prismaNamespace";

export class PrismaIncomeRepository implements IncomeRepository {
    async create(data: CreateIncomeData) {
        const income = await prisma.income.create({
            data: {
                title: data.title,
                amount: data.amount,
                receivedAt: data.receivedAt,
                updatedAt: data.updatedAt,

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
        const incomes = await prisma.income.findMany({
            where: {
                userId,
                receivedAt: {
                    gte: startDate,
                    lt: endDate
                }
            },

            orderBy: {
                receivedAt: "desc"
            }
        });

        return incomes;
    }

    async getTotalByCategory(userId: string, categoryId: string, startDate: Date, endDate: Date) {

        const totalIncome = await prisma.income.aggregate({
            where: {
                userId,
                categoryId,
                receivedAt: {
                    gte: startDate,
                    lt: endDate
                },
            },
            _sum: {
                amount: true
            }
        });

        return totalIncome._sum.amount ?? new Decimal(0);
    }

    async update(id: string, data: UpdateIncomeData) {
        const income = await prisma.income.update({
            where: {
                id
            },
            data
        });

        return income;
    }

    async delete(id: string) {
        await prisma.income.delete({
            where: {
                id,
            }
        });
    }
}