import type { CreateIncomeData, IncomeRepository, UpdateIncomeData, Income } from "@/repositories/income-repository";
import { randomUUID } from "node:crypto";

export class InMemoryIncomeRepository implements IncomeRepository {
    public items: Income[] = [];

    async create(data: CreateIncomeData) {
        const income = {
            id: randomUUID(),
            title: data.title,
            amount: data.amount,
            receivedAt: new Date(),
            categoryId: data.categoryId,
            userId: data.userId,
            updatedAt: null,
            deletedAt: null
        };

        this.items.push(income);

        return income;
    }

    async findById(id: string) {
        const income = this.items.find((item) => item.id === id);

        if (!income) {
            return null;
        }

        return income;
    }

    async findManyByUserIdBetweenDates(userId: string, startDate: Date, endDate: Date, page: number) {
        const userIncomes = this.items
            .filter((item) =>
                item.userId === userId &&
                item.receivedAt >= startDate &&
                item.receivedAt < endDate
            )
            .sort((firstIncome, secondIncome) => firstIncome.receivedAt.getTime() - secondIncome.receivedAt.getTime())
            .slice((page - 1) * 20, page * 20);

        return userIncomes;
    }

    async findManyByCategoryId(userId: string, categoryId: string, startDate: Date, endDate: Date, page: number) {
        const categoryIncomes = this.items.
            filter((item) =>
                item.userId === userId &&
                item.categoryId === categoryId &&
                item.receivedAt >= startDate &&
                item.receivedAt <= endDate
            )
            .sort((firstIncome, secondIncome) => firstIncome.receivedAt.getTime() - secondIncome.receivedAt.getTime())
            .slice((page - 1) * 20, page * 20);

        return categoryIncomes;
    }

    async getTotalByCategoryId(userId: string, categoryId: string, startDate: Date, endDate: Date) {
        const total = this.items.filter((item) =>
            item.userId === userId &&
            item.categoryId === categoryId &&
            item.receivedAt >= startDate &&
            item.receivedAt <= endDate
        ).reduce((accumulator, income) => accumulator + income.amount, 0);

        return total;
    }

    async getTotalByUserId(userId: string, startDate: Date, endDate: Date) {
        const total = this.items.filter((item) =>
            item.userId === userId &&
            item.receivedAt >= startDate &&
            item.receivedAt <= endDate
        ).reduce((accumulator, income) => accumulator + income.amount, 0);

        return total;
    }

    async getTotal(userId: string, startDate: Date, endDate: Date) {
        const total = this.items.filter((item) =>
            item.userId === userId &&
            item.receivedAt >= startDate &&
            item.receivedAt <= endDate
        ).reduce((accumulator, income) => accumulator + income.amount, 0);

        return total;
    }

    async update(id: string, data: UpdateIncomeData) {
        const income = this.items.find((item) => item.id === id)!;

        if (!income) {
            return null;
        }

        Object.assign(income, data);

        return income;
    }

    async delete(id: string) {
        const income = this.items.find((item) => item.id === id);

        if (income) {
            income.deletedAt = new Date();
        }
    }
}