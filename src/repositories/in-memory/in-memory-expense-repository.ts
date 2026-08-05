import type { Expense } from "../expense-repository";
import type { CreateExpenseData, ExpenseRepository, UpdateExpenseData } from "../expense-repository";
import { randomUUID } from "node:crypto";
import { Decimal } from "@/generated/prisma/internal/prismaNamespace";

export class InMemoryExpenseRepository implements ExpenseRepository {
    public items: Expense[] = [];

    async create(data: CreateExpenseData) {
        const expense = {
            id: randomUUID(),
            title: data.title,
            amount: data.amount,
            paidAt: data.paidAt,
            categoryId: data.categoryId,
            userId: data.userId,
            updatedAt: null,
            deletedAt: null
        };

        this.items.push(expense);

        return expense;
    }

    async findById(id: string) {
        const expense = this.items.find((item) => item.id === id);

        if (!expense) {
            return null;
        }

        return expense;
    }

    async findManyByUserIdBetweenDates(userId: string, startDate: Date, endDate: Date) {
        const expenses = this.items.filter((item) =>
            item.userId === userId &&
            item.paidAt >= startDate &&
            item.paidAt < endDate
        );

        return expenses;
    }

    async findManyByCategoryId(categoryId: string) {
        const exepenses = this.items.filter((item) =>
            item.categoryId === categoryId
        );

        return exepenses;
    }

    async getTotalByCategory(userId: string, categoryId: string) {
        const totalExpense = this.items.filter((item) =>
            item.userId === userId &&
            item.categoryId === categoryId
        ).reduce(
            (accumulator, expense) => accumulator.plus(expense.amount),
            new Decimal(0)
        );

        return totalExpense;
    }

    async update(id: string, data: UpdateExpenseData) {
        const expense = this.items.find((item) => item.id === id);

        if (!expense) {
            return null;
        }

        Object.assign(expense, data);

        return expense;
    }

    async delete(id: string) {
        const expense = this.items.find((items) => items.id === id);

        expense!.deletedAt = new Date();
    }
}