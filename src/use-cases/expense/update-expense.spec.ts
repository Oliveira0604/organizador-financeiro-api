import { beforeEach, describe, expect, it } from "vitest";
import { UpdateExpenseUseCase } from "./update-expense-use-case";
import { InMemoryCategoryRepository } from "@/repositories/in-memory/in-memory-category-repository";
import { InMemoryExpenseRepository } from "@/repositories/in-memory/in-memory-expense-repository";
import { Decimal } from "@/generated/prisma/internal/prismaNamespace";
import type { Expense } from "@/repositories/expense-repository";
import type { Category } from "@/repositories/category-repository";

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
            createdAt: new Date(),
            updatedAt: null
        });

        expense = await expenseRepository.create({
            title: "arroz",
            amount: new Decimal(15),
            categoryId: category.id,
            paidAt: new Date(),
            userId: "user-01",
        });
    });

    it("should be able to update an expense name", async () => {
        await updateExpenseUseCase.execute({
            id: expense.id,
            title: "feijao",
            amount: new Decimal(15),
            categoryName: "mercado",
            userId: "user-01",
        });

        expect(expense.title).toEqual("feijao");
    });

    it("should be able to update an expense amount", async () => {
        await updateExpenseUseCase.execute({
            id: expense.id,
            title: "feijão",
            amount: new Decimal(25),
            categoryName: "mercado",
            userId: "user-01"
        });

        expect(expense.amount).toEqual(new Decimal(25));
    });

    it("should be able to update an expense category", async () => {
        const newCategory = await categoryRepository.create({
            name: "padaria",
            userId: "user-01",
            createdAt: new Date(),
            updatedAt: null
        });

        await updateExpenseUseCase.execute({
            id: expense.id,
            title: "feijão",
            amount: new Decimal(25),
            categoryName: "padaria",
            userId: "user-01"
        });

        expect(expense.categoryId).toEqual(newCategory.id);
    });
});