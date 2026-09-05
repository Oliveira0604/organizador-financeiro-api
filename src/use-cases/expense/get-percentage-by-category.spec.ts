import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GetPercentageByCategoryUseCase } from "./get-percentage-by-category-use-case";
import { InMemoryExpenseRepository } from "@/repositories/in-memory/in-memory-expense-repository";
import { Decimal } from "@/generated/prisma/internal/prismaNamespace";
import type { User } from "@/repositories/user-repository";
import { InMemoryCategoryRepository } from "@/repositories/in-memory/in-memory-category-repository";
import { InMemoryUserRepository } from "@/repositories/in-memory/in-memory-user-repository";
import type { Category } from "@/repositories/category-repository";

let expenseRepository: InMemoryExpenseRepository;
let categoryRepository: InMemoryCategoryRepository;
let userRepository: InMemoryUserRepository;
let getPercentageByCategoryUseCase: GetPercentageByCategoryUseCase;
let user: User;
let firstCategory: Category;
let secondCategory: Category;
let thridCategory: Category;

describe("Get Percentage By Category Use Case", () => {
    beforeEach(async () => {
        expenseRepository = new InMemoryExpenseRepository();
        categoryRepository = new InMemoryCategoryRepository();
        userRepository = new InMemoryUserRepository();
        getPercentageByCategoryUseCase = new GetPercentageByCategoryUseCase(expenseRepository, categoryRepository, userRepository);
        vi.useFakeTimers();

        user = await userRepository.create({
            name: "Nathan",
            phoneNumber: "+55 11 9999-9999"
        });

        firstCategory = await categoryRepository.create({
            name: "food expenses",
            userId: user.id
        });

        secondCategory = await categoryRepository.create({
            name: "leisure expenses",
            userId: user.id
        });

        thridCategory = await categoryRepository.create({
            name: "house expenses",
            userId: user.id
        });

        vi.setSystemTime(new Date(2026, 7, 3));

        await expenseRepository.create({
            title: "supermarket",
            amount: new Decimal(100),
            categoryId: firstCategory.id,
            userId: user.id
        });

        vi.setSystemTime(new Date(2026, 7, 5));

        await expenseRepository.create({
            title: "supermarket",
            amount: new Decimal(200),
            categoryId: firstCategory.id,
            userId: user.id
        });

        vi.setSystemTime(new Date(2026, 7, 15));

        await expenseRepository.create({
            title: "trip",
            amount: new Decimal(100),
            categoryId: secondCategory.id,
            userId: user.id
        });

        vi.setSystemTime(new Date(2026, 7, 25));

        await expenseRepository.create({
            title: "electricity bill",
            amount: new Decimal(100),
            categoryId: thridCategory.id,
            userId: user.id
        });

        vi.setSystemTime(new Date(2026, 7, 31));

        await expenseRepository.create({
            title: "supermarket",
            amount: new Decimal(200),
            categoryId: firstCategory.id,
            userId: user.id
        });

    });

    afterEach(() => {
        vi.useRealTimers();
    });


    it("should be able to get the user percentage of spent by category in the provided range of date", async () => {

        const { percentage } = await getPercentageByCategoryUseCase.execute({
            userId: user.id,
            categoryId: firstCategory.id,
            startDate: new Date(2026, 7, 1),
            endDate: new Date(2026, 7, 25)
        });

        expect(percentage).toEqual(new Decimal(60));
    });

    it("should get the the percentage by category from the current month if the range of date is not provided", async () => {
        vi.setSystemTime(new Date(2026, 8, 1));

        await expenseRepository.create({
            title: "supermarket",
            amount: new Decimal(100),
            userId: user.id,
            categoryId: firstCategory.id
        });

        await expenseRepository.create({
            title: "shopping mall",
            amount: new Decimal(300),
            userId: user.id,
            categoryId: secondCategory.id
        });

        const { percentage: currentMonthPercentage } = await getPercentageByCategoryUseCase.execute({
            userId: user.id,
            categoryId: firstCategory.id,
        });

        console.log(expenseRepository.items);

        expect(currentMonthPercentage).toEqual(new Decimal(25));
    });
});