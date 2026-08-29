import type { Expense } from "../expense-repository";
import type { CreateExpenseData, ExpenseRepository, UpdateExpenseData } from "../expense-repository";
import { randomUUID } from "node:crypto";
import { Decimal } from "@/generated/prisma/internal/prismaNamespace";
import { ResourceNotFoundError } from "@/errors/resource-not-found-error";

export class InMemoryExpenseRepository implements ExpenseRepository {
    public items: Expense[] = [];

    async create(data: CreateExpenseData) {
        const expense = {
            id: randomUUID(),
            title: data.title,
            amount: data.amount,
            paidAt: new Date(),
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
        const expenses = this.items.
            filter((item) =>
                item.userId === userId &&
                item.paidAt >= startDate &&
                item.paidAt < endDate,
            )
            .sort((firstExpense, secondExpense) => firstExpense.paidAt.getTime() - secondExpense.paidAt.getTime());

        return expenses;
    }

    async findManyByCategoryId(categoryId: string, startDate: Date, endDate: Date) {
        const exepenses = this.items
            .filter((item) =>
                item.categoryId === categoryId &&
                item.paidAt >= startDate &&
                item.paidAt <= endDate
            )
            .sort((firstExpense, secondExpense) => firstExpense.paidAt.getTime() - secondExpense.paidAt.getTime());

        return exepenses;
    }

    async getTotalByCategoryId(userId: string, categoryId: string, startDate: Date, endDate: Date) {
        const categoryTotal = this.items.filter((item) =>
            item.userId === userId &&
            item.categoryId === categoryId &&
            item.paidAt >= startDate &&
            item.paidAt <= endDate
        ).reduce(
            (accumulator, expense) => accumulator.plus(expense.amount),
            new Decimal(0)
        );

        return categoryTotal;
    }

    async getTotalByUserId(userId: string, startDate: Date, endDate: Date) {
        const userTotal = this.items.filter((item) =>
            item.userId === userId &&
            item.paidAt >= startDate &&
            item.paidAt <= endDate
        ).reduce(
            (accumulator, expense) => accumulator.plus(expense.amount), new Decimal(0)
        );

        return userTotal;
    }

    async getTotal(userId: string, startDate: Date, endDate: Date) {
        const total = this.items.filter((item) =>
            item.userId === userId &&
            item.paidAt >= startDate &&
            item.paidAt <= endDate
        ).reduce((accumulator, expense) => accumulator.plus(expense.amount), new Decimal(0));


        return total;
    }

    async update(id: string, data: UpdateExpenseData) {
        const expense = this.items.find((item) => item.id === id);

        if (!expense) {
            throw new ResourceNotFoundError();
        }

        Object.assign(expense, data);

        return expense;
    }

    async delete(id: string, userId: string) {
        const expense = this.items.find((items) => items.id === id && items.userId === userId);

        if (!expense) {
            throw new ResourceNotFoundError();
        }

        expense.deletedAt = new Date();
    }
}