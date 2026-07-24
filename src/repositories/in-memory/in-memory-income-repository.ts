import type { Income } from "@/generated/prisma/client";
import type { CreateIncomeData, IncomeRepository, UpdateIncomeData } from "../income-repository";
import { randomUUID } from "node:crypto";
import { Decimal } from "@/generated/prisma/internal/prismaNamespace";

export class InMemoryIncomeRepository implements IncomeRepository {
    public items: Income[] = [];

    async create(data: CreateIncomeData) {
        const income = {
            id: randomUUID(),
            title: data.title,
            amount: data.amount,
            receivedAt: data.receivedAt,
            categoryId: data.categoryId,
            userId: data.userId,
            updatedAt: data.updatedAt
        };

        this.items.push(income);

        return income;
    }

    async findById(id: string) {
        const income = this.items.find((item) => item.id === id);

        if (!income) {
            throw new ResourceNotFoundError();
        }

        return income;
    }

    async findManyByUserIdBetweenDates(userId: string, startDate: Date, endDate: Date) {
        const incomes = this.items.filter((item) =>
            item.userId === userId &&
            item.receivedAt >= startDate &&
            item.receivedAt < endDate
        );

        return incomes;
    }

    async getTotalByCategory(userId: string, categoryId: string, startDate: Date, endDate: Date) {
        const total = this.items.filter((item) =>
            item.userId === userId &&
            item.categoryId === categoryId &&
            item.receivedAt >= startDate &&
            item.receivedAt < endDate
        ).reduce((accumulator, income) => accumulator.plus(income.amount), new Decimal(0));

        return total;
    }

    async update(userId: string, id: string, data: UpdateIncomeData) {
        const income = this.items.find((item) => item.id === id);

        if (!income) {
            throw new ResourceNotFoundError();
        }

        if (income.userId !== userId) {
            throw new NotAllowedError();
        }

        Object.assign(income, data);

        return income;
    }
}