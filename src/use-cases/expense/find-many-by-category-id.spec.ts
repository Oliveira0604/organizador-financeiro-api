import { InMemoryExpenseRepository } from "@/repositories/in-memory/in-memory-expense-repository";
import { beforeEach, describe, expect, it } from "vitest";
import { FindManyByCategoryIdUseCase } from "./find-many-by-category-id-use-case";
import { Decimal } from "@/generated/prisma/internal/prismaNamespace";
import { InMemoryCategoryRepository } from "@/repositories/in-memory/in-memory-category-repository";
import type { Category } from "@/repositories/category-repository";
import { ResourceNotFoundError } from "@/errors/resource-not-found-error";
import { NotAllowedError } from "@/errors/not-allowed-error";

let expenseRepository: InMemoryExpenseRepository;
let categoryRepository: InMemoryCategoryRepository;
let findManyByCategoryId: FindManyByCategoryIdUseCase;
let category: Category;

describe("Find Many By Category Id Use Case", () => {
    beforeEach(async () => {
        expenseRepository = new InMemoryExpenseRepository();
        categoryRepository = new InMemoryCategoryRepository();
        findManyByCategoryId = new FindManyByCategoryIdUseCase(expenseRepository, categoryRepository);

        category = await categoryRepository.create({
            name: "supermarket",
            userId: "user-01"
        });
    });

    it("should be able to get the category expenses", async () => {
        await expenseRepository.create({
            title: "supermarket",
            amount: new Decimal(100),
            categoryId: category.id,
            userId: "user-01",
        });

        await expenseRepository.create({
            title: "supermarket",
            amount: new Decimal(200),
            categoryId: category.id,
            userId: "user-01",
        });

        const { expenses } = await findManyByCategoryId.execute({
            userId: "user-01",
            categoryId: category.id
        });

        expect(expenses).toHaveLength(2);
        expect(expenses[0]!.title).toEqual("supermarket");
        expect(expenses[0]!.amount).toEqual(new Decimal(100));
        expect(expenses[0]!.categoryId).toEqual(category.id);
        expect(expenses[0]!.userId).toEqual("user-01");

        expect(expenses[1]!.title).toEqual("supermarket");
        expect(expenses[1]!.amount).toEqual(new Decimal(200));
        expect(expenses[1]!.categoryId).toEqual(category.id);
        expect(expenses[1]!.userId).toEqual("user-01");
    });

    it("should not be able to get the expenses if the category doesn't exist", async () => {
        await expect(
            findManyByCategoryId.execute({
                categoryId: "non-existent",
                userId: "user-01"
            })
        ).rejects.toBeInstanceOf(ResourceNotFoundError);
    });

    it("should not be able to get the expenses if the userId is different", async () => {
        await expect(
            findManyByCategoryId.execute({
                categoryId: category.id,
                userId: "diferent-user-id"
            })
        ).rejects.toBeInstanceOf(NotAllowedError);
    });

    it("should not return expenses from another category", async () => {
        const gymCategory = await categoryRepository.create({
            name: "gym",
            userId: "user-01"
        });

        await expenseRepository.create({
            title: "supermarket",
            amount: new Decimal(100),
            categoryId: category.id,
            userId: "user-01",
        });

        await expenseRepository.create({
            title: "supermarket",
            amount: new Decimal(200),
            categoryId: category.id,
            userId: "user-01",
        });

        await expenseRepository.create({
            title: "gym",
            amount: new Decimal(150),
            categoryId: gymCategory.id,
            userId: "user-01"
        });

        const { expenses } = await findManyByCategoryId.execute({
            categoryId: category.id,
            userId: "user-01"
        });

        expect(expenses).toHaveLength(2);
        expenses.forEach((expense) => {
            expect(expense.categoryId).toEqual(category.id);
        });

    });
});