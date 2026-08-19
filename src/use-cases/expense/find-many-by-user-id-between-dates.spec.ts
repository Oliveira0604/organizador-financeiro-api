import { InMemoryExpenseRepository } from "@/repositories/in-memory/in-memory-expense-repository";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { FindManyByUserIdBetweenDatesUseCase } from "./find-many-by-user-id-between-dates-use-case";
import { Decimal } from "@/generated/prisma/internal/prismaNamespace";
import { InMemoryUserRepository } from "@/repositories/in-memory/in-memory-user-repository";
import type { User } from "@/repositories/user-repository";

let expenseRepository: InMemoryExpenseRepository;
let userRepository: InMemoryUserRepository;
let findManyByUserIdBetweenDates: FindManyByUserIdBetweenDatesUseCase;
let user: User;
let secondUser: User;

describe("Find Many By User Id Between Dates Use Case", () => {
    beforeEach(async () => {
        expenseRepository = new InMemoryExpenseRepository();
        userRepository = new InMemoryUserRepository();
        findManyByUserIdBetweenDates = new FindManyByUserIdBetweenDatesUseCase(expenseRepository, userRepository);
        vi.useFakeTimers();

        vi.setSystemTime(new Date(2026, 7, 5));

        user = await userRepository.create({
            name: "Nathan",
            phoneNumber: "+55 11 9999-9999"
        });

        secondUser = await userRepository.create({
            name: "John",
            phoneNumber: "+55 11 9999-9999"
        });


        await expenseRepository.create({
            amount: new Decimal(100),
            categoryId: "category-01",
            title: "Supermarket",
            userId: user.id
        });

        vi.setSystemTime(new Date(2026, 7, 10));

        await expenseRepository.create({
            amount: new Decimal(200),
            categoryId: "category-01",
            title: "Supermarket",
            userId: user.id
        });

        vi.setSystemTime(new Date(2026, 7, 10));

        await expenseRepository.create({
            amount: new Decimal(200),
            categoryId: "category-01",
            title: "Supermarket",
            userId: secondUser.id
        });

        await expenseRepository.create({
            amount: new Decimal(200),
            categoryId: "category-01",
            title: "Supermarket",
            userId: secondUser.id
        });

    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("should get the user expenses between two dates", async () => {
        const { expenses } = await findManyByUserIdBetweenDates.execute({
            userId: user.id,
            startDate: new Date(2026, 7, 1),
            endDate: new Date(2026, 7, 30)
        });

        expect(expenses).toHaveLength(2);
        expect(expenses[0]?.paidAt).toEqual(new Date(2026, 7, 5));
        expect(expenses[1]?.paidAt).toEqual(new Date(2026, 7, 10));
        expect(expenses[0]?.userId).toEqual(user.id);
        expect(expenses[1]?.userId).toEqual(user.id);
    });

    it("should not get the expenses from another person", async () => {
        const { expenses } = await findManyByUserIdBetweenDates.execute({
            userId: secondUser.id,
            startDate: new Date(2026, 7, 1),
            endDate: new Date(2026, 7, 31)
        });

        expect(expenses).toHaveLength(2);
    });

    it("should not get an expense that is not in the interval", async () => {
        vi.setSystemTime(new Date(2026, 8, 1));

        const testExpense = await expenseRepository.create({
            title: "supermarket",
            amount: new Decimal(700),
            categoryId: "category-01",
            userId: user.id
        });

        const { expenses } = await findManyByUserIdBetweenDates.execute({
            userId: user.id,
            startDate: new Date(2026, 7, 1),
            endDate: new Date(2026, 7, 31)
        });

        expect(expenses).toHaveLength(2);
        expect(expenses.find((expense) => expense.id === testExpense.id)).toBeUndefined();
    });

    it("should return an empty array if there is no expense in the given date range", async () => {
        const { expenses } = await findManyByUserIdBetweenDates.execute({
            userId: user.id,
            startDate: new Date(2026, 8, 1),
            endDate: new Date(2026, 8, 30)
        });

        expect(expenses).toEqual([]);
    });
});
