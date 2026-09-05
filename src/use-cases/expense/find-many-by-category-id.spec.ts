import { InMemoryExpenseRepository } from "@/repositories/in-memory/in-memory-expense-repository";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { FindManyByCategoryIdUseCase } from "./find-many-by-category-id-use-case";
import { Decimal } from "@/generated/prisma/internal/prismaNamespace";
import { InMemoryCategoryRepository } from "@/repositories/in-memory/in-memory-category-repository";
import type { Category } from "@/repositories/category-repository";
import { ResourceNotFoundError } from "@/errors/resource-not-found-error";
import { NotAllowedError } from "@/errors/not-allowed-error";
import { InMemoryUserRepository } from "@/repositories/in-memory/in-memory-user-repository";
import type { User } from "@/repositories/user-repository";
import { InvalidDateError } from "@/errors/invalid-date-error";

let expenseRepository: InMemoryExpenseRepository;
let categoryRepository: InMemoryCategoryRepository;
let userRepository: InMemoryUserRepository;
let findManyByCategoryId: FindManyByCategoryIdUseCase;
let category: Category;
let user: User;

describe("Find Many By Category Id Use Case", () => {
    beforeEach(async () => {
        expenseRepository = new InMemoryExpenseRepository();
        categoryRepository = new InMemoryCategoryRepository();
        userRepository = new InMemoryUserRepository();
        findManyByCategoryId = new FindManyByCategoryIdUseCase(expenseRepository, categoryRepository, userRepository);
        vi.useFakeTimers();

        user = await userRepository.create({
            name: "Nathan",
            phoneNumber: "+55 11 9999-9999"
        });

        category = await categoryRepository.create({
            name: "supermarket",
            userId: user.id
        });


        vi.setSystemTime(new Date(2026, 7, 3));

        await expenseRepository.create({
            title: "supermarket",
            amount: new Decimal(100),
            categoryId: category.id,
            userId: user.id,
        });

        vi.setSystemTime(new Date(2026, 7, 25));

        await expenseRepository.create({
            title: "supermarket",
            amount: new Decimal(200),
            categoryId: category.id,
            userId: user.id,
        });
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("should be able to get the category expenses", async () => {
        const { expenses } = await findManyByCategoryId.execute({
            userId: user.id,
            categoryId: category.id,
            startDate: new Date(2026, 7, 1),
            endDate: new Date(2026, 7, 31)
        });

        expect(expenses).toHaveLength(2);
        expect(expenses[0]!.title).toEqual("supermarket");
        expect(expenses[0]!.amount).toEqual(new Decimal(100));
        expect(expenses[0]!.categoryId).toEqual(category.id);
        expect(expenses[0]!.userId).toEqual(user.id);

        expect(expenses[1]!.title).toEqual("supermarket");
        expect(expenses[1]!.amount).toEqual(new Decimal(200));
        expect(expenses[1]!.categoryId).toEqual(category.id);
        expect(expenses[1]!.userId).toEqual(user.id);
    });

    it("should get the expenses from current month if the range of date is not provided", async () => {
        const { expenses } = await findManyByCategoryId.execute({
            userId: user.id,
            categoryId: category.id
        });

        expect(expenses).toHaveLength(2);
        expect(expenses[0]!.title).toEqual("supermarket");
        expect(expenses[0]!.amount).toEqual(new Decimal(100));
        expect(expenses[0]!.categoryId).toEqual(category.id);
        expect(expenses[0]!.userId).toEqual(user.id);

        expect(expenses[1]!.title).toEqual("supermarket");
        expect(expenses[1]!.amount).toEqual(new Decimal(200));
        expect(expenses[1]!.categoryId).toEqual(category.id);
        expect(expenses[1]!.userId).toEqual(user.id);
    });

    it("should not get the expenses if start date is greater than end date", async () => {
        await expect(
            findManyByCategoryId.execute({
                userId: user.id,
                categoryId: category.id,
                startDate: new Date(2026, 7, 31),
                endDate: new Date(2026, 7, 1)
            })
        ).rejects.toBeInstanceOf(InvalidDateError);
    });

    it("should not be able to get the expenses if the category doesn't exist", async () => {
        await expect(
            findManyByCategoryId.execute({
                categoryId: "non-existent",
                userId: user.id
            })
        ).rejects.toBeInstanceOf(ResourceNotFoundError);
    });

    it("should not be able to get the expenses if the userId is different", async () => {
        const secondUser = await userRepository.create({
            name: "May",
            phoneNumber: "+55 11 8888-8888"
        });

        await expect(
            findManyByCategoryId.execute({
                categoryId: category.id,
                userId: secondUser.id
            })
        ).rejects.toBeInstanceOf(NotAllowedError);
    });

    it("should not return expenses from another category", async () => {
        const gymCategory = await categoryRepository.create({
            name: "gym",
            userId: user.id
        });

        await expenseRepository.create({
            title: "gym",
            amount: new Decimal(150),
            categoryId: gymCategory.id,
            userId: user.id
        });

        const { expenses } = await findManyByCategoryId.execute({
            categoryId: category.id,
            userId: user.id
        });

        expect(expenses).toHaveLength(2);
        expenses.forEach((expense) => {
            expect(expense.categoryId).toEqual(category.id);
        });

    });
});