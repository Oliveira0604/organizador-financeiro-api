import type { Prisma } from "@/generated/prisma/client";
import type { IncomeRepository } from "../income-repository";
import { prisma } from "@/lib/prisma";
import { Decimal } from "@/generated/prisma/internal/prismaNamespace";

export class PrismaIncomeRepository implements IncomeRepository {
    async create(data: Prisma.IncomeCreateInput) {
        const income = await prisma.income.create({
            data,
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

    async findManyByUserIdAndDate(userId: string, startDate: Date, endDate: Date) {
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

    async getTotalByCategory(userId: string, category: string, startDate: Date, endDate: Date) {
        const doesTheCategoryExist = await prisma.category.findUnique({
            where: {
                userId_name: {
                    userId,
                    name: category,
                }
            }
        });

        if (!doesTheCategoryExist) {
            throw new ResourceNotFoundError();
        }

        const totalIncome = await prisma.income.aggregate({
            where: {
                userId,
                categoryId: doesTheCategoryExist.id,
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

    async update(userId: string, id: string, data: Prisma.IncomeUpdateInput) {

        const category = await prisma.income.findUnique({
            where: {
                id,
            }
        });

        if (!category) {
            throw new ResourceNotFoundError();
        }

        if (category.userId !== userId) {
            throw new NotAllowedError();
        }


        const income = await prisma.income.update({
            where: {
                id
            },
            data
        });

        return income;
    }

    async delete(userId: string, id: string) {
        const income = await prisma.income.findUnique({
            where: {
                id,
            }
        });

        if (!income) {
            throw new ResourceNotFoundError();
        }

        if (income.userId !== userId) {
            throw new NotAllowedError();
        }

        await prisma.income.delete({
            where: {
                id,
            }
        });
    }
}