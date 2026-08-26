import { InMemoryExpenseRepository } from "@/repositories/in-memory/in-memory-expense-repository";
import { describe, expect, it, beforeEach } from "vitest";
import { CreateExpenseUseCase } from "./create-expense-use-case";
import { Decimal } from "@/generated/prisma/internal/prismaNamespace";
import { InMemoryCategoryRepository } from "@/repositories/in-memory/in-memory-category-repository";
import type { Category } from "@/repositories/category-repository";
import { NotAllowedError } from "@/errors/not-allowed-error";
import { InvalidAmountError } from "@/errors/is-amount-valid-error";
import { ResourceNotFoundError } from "@/errors/resource-not-found-error";

let expenseRepository: InMemoryExpenseRepository;
let categoryRepository: InMemoryCategoryRepository;
let createExpenseUseCase: CreateExpenseUseCase;
let category: Category;

describe("Create Expense Use Case", () => {
    beforeEach(async () => {
        expenseRepository = new InMemoryExpenseRepository();
        categoryRepository = new InMemoryCategoryRepository();
        createExpenseUseCase = new CreateExpenseUseCase(expenseRepository, categoryRepository);

        category = await categoryRepository.create({
            name: "supermarket",
            userId: "user-01"
        });
    });

    it("should be able to create an expense", async () => {
        const { expense } = await createExpenseUseCase.execute({
            title: "test",
            amount: new Decimal(100),
            categoryId: category.id,
            userId: "user-01"
        });

        expect(expense.id).toEqual(expect.any(String));
        expect(expense.title).toEqual("test");
        expect(expense.amount).toEqual(new Decimal(100));
        expect(expense.categoryId).toEqual(category.id);
        expect(expense.userId).toEqual("user-01");
    });

    it("should not create an expense if the category doesn't exist", async () => {
        await expect(
            createExpenseUseCase.execute({
                title: "supermarket",
                amount: new Decimal(100),
                categoryId: "non-existent category",
                userId: "user-01"
            })
        ).rejects.toBeInstanceOf(ResourceNotFoundError);

        expect(expenseRepository.items).toHaveLength(0);
    });

    it("should not be able to create an expense if the userId is different", async () => {
        await expect(
            createExpenseUseCase.execute({
                title: "supermarket",
                amount: new Decimal(100),
                categoryId: category.id,
                userId: "different-id"
            })
        ).rejects.toBeInstanceOf(NotAllowedError);
        expect(expenseRepository.items).toHaveLength(0);
    });

    it("should not be able to create an expense with an amount equals 0", async () => {
        await expect(
            createExpenseUseCase.execute({
                title: "supermarket",
                amount: new Decimal(0),
                categoryId: category.id,
                userId: "user-01"
            })
        ).rejects.toBeInstanceOf(InvalidAmountError);
        expect(expenseRepository.items).toHaveLength(0);
    });

    it("should not be able to create an expense with a negative amount", async () => {
        await expect(
            createExpenseUseCase.execute({
                title: "supermarket",
                amount: new Decimal(-10),
                categoryId: category.id,
                userId: "user-01"
            })
        ).rejects.toBeInstanceOf(InvalidAmountError);
        expect(expenseRepository.items).toHaveLength(0);
    });
});
