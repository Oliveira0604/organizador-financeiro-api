import type { Expense } from "@/generated/prisma/client";
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
            updatedAt: data.updatedAt
        };

        this.items.push(expense);

        return expense;
    }

    async findById(id: string) {
        const expense = this.items.find((item) => item.id === id);

        if (!expense) {
            throw new ResourceNotFoundError();
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

    async update(userId: string, id: string, data: UpdateExpenseData) {
        const expense = this.items.find((item) => item.id === id);

        if (!expense) {
            throw new ResourceNotFoundError();
        }

        if (expense.userId !== userId) {
            throw NotAllowedError();
        }

        Object.assign(expense, data);

        return expense;
    }

    async delete(userId: string, id: string) {
        const expenseIndex = this.items.findIndex((items) => items.id === id);

        if (expenseIndex === -1) {
            throw new ResourceNotFoundError();
        }

        if (this.items[expenseIndex]!.userId !== userId) {
            throw new NotAllowedError();
        }

        this.items.splice(expenseIndex, 1);
    }
}