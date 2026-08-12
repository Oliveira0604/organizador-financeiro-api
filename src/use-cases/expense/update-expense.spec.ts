import { beforeEach, describe, expect, it } from "vitest";
import { UpdateExpenseUseCase } from "./update-expense-use-case";
import { InMemoryCategoryRepository } from "@/repositories/in-memory/in-memory-category-repository";
import { InMemoryExpenseRepository } from "@/repositories/in-memory/in-memory-expense-repository";
import { Decimal } from "@/generated/prisma/internal/prismaNamespace";
import type { Expense } from "@/repositories/expense-repository";
import type { Category } from "@/repositories/category-repository";
import { ResourceNotFoundError } from "@/errors/resource-not-found-error";
import { NotAllowedError } from "@/errors/not-allowed-error";
import { InvalidAmountError } from "@/errors/is-amount-valid-error";

let expenseRepository: InMemoryExpenseRepository;
let categoryRepository: InMemoryCategoryRepository;
let updateExpenseUseCase: UpdateExpenseUseCase;

let category: Category;
let expense: Expense;

describe("Update Expense Use Case", () => {
    beforeEach(async () => {
        expenseRepository = new InMemoryExpenseRepository();
        categoryRepository = new InMemoryCategoryRepository();
        updateExpenseUseCase = new UpdateExpenseUseCase(expenseRepository, categoryRepository);

        category = await categoryRepository.create({
            name: "mercado",
            userId: "user-01",
        });

        expense = await expenseRepository.create({
            title: "arroz",
            amount: new Decimal(15),
            categoryId: category.id,
            userId: "user-01",
        });
    });

    it("should be able to update only the expense name", async () => {
        const updatedExpense = await updateExpenseUseCase.execute({
            id: expense.id,
            title: "feijao",
            userId: "user-01",
        });

        expect(updatedExpense.expense.title).toEqual("feijao");
        expect(updatedExpense.expense.amount).toEqual(new Decimal(15));
        expect(updatedExpense.expense.categoryId).toEqual(category.id);
    });

    it("should be able to update only the expense amount", async () => {
        const updatedExpense = await updateExpenseUseCase.execute({
            id: expense.id,
            amount: new Decimal(25),
            userId: "user-01"
        });

        expect(updatedExpense.expense.amount).toEqual(new Decimal(25));
        expect(updatedExpense.expense.categoryId).toEqual(category.id);
        expect(updatedExpense.expense.title).toEqual("arroz");
    });

    it("should be able to update only the expense category", async () => {
        const newCategory = await categoryRepository.create({
            name: "padaria",
            userId: "user-01",
        });

        const updatedExpense = await updateExpenseUseCase.execute({
            id: expense.id,
            categoryName: "padaria",
            userId: "user-01"
        });

        expect(updatedExpense.expense.categoryId).toEqual(newCategory.id);
        expect(updatedExpense.expense.title).toEqual("arroz");
        expect(updatedExpense.expense.amount).toEqual(new Decimal(15));
    });

    it("should not be able to update any field if the expense doesn't exist", async () => {
        await expect(
            updateExpenseUseCase.execute({
                id: "expense-id",
                title: "arroz",
                amount: new Decimal(100),
                categoryName: "test",
                userId: "user-01"
            })
        ).rejects.toBeInstanceOf(ResourceNotFoundError);
    });

    it("should not update an expense from another person", async () => {
        await expect(
            updateExpenseUseCase.execute({
                id: expense.id,
                title: "arroz",
                amount: new Decimal(25),
                userId: "user-02"
            })
        ).rejects.toBeInstanceOf(NotAllowedError);
    });

    it("should not update with a negative amount", async () => {
        await expect(
            updateExpenseUseCase.execute({
                id: expense.id,
                amount: new Decimal(-10),
                userId: "user-01"
            })
        ).rejects.toBeInstanceOf(InvalidAmountError);
    });

    it("should not update if the category doesn't exist", async () => {
        await expect(
            updateExpenseUseCase.execute({
                id: expense.id,
                categoryName: "non-existent",
                userId: "user-01"
            })
        ).rejects.toBeInstanceOf(ResourceNotFoundError);
    });
});