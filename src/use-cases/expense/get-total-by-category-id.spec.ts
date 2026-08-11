import { describe, it, expect, beforeEach } from "vitest";
import { GetTotalByCategoryIdUseCase } from "./get-total-by-category-id-use-case";
import { InMemoryExpenseRepository } from "@/repositories/in-memory/in-memory-expense-repository";
import { Decimal } from "@/generated/prisma/internal/prismaNamespace";
import { InMemoryCategoryRepository } from "@/repositories/in-memory/in-memory-category-repository";
import type { Category } from "@/repositories/category-repository";
import { ResourceNotFoundError } from "@/errors/resource-not-found-error";
import { NotAllowedError } from "@/errors/not-allowed-error";

let expenseRepository: InMemoryExpenseRepository;
let categoryRepository: InMemoryCategoryRepository;
let getTotalByCategoryIdUseCase: GetTotalByCategoryIdUseCase;
let category: Category;

describe("Get Total By Category Id Use Case", () => {
    beforeEach(async () => {
        expenseRepository = new InMemoryExpenseRepository();
        categoryRepository = new InMemoryCategoryRepository();
        getTotalByCategoryIdUseCase = new GetTotalByCategoryIdUseCase(expenseRepository, categoryRepository);

        category = await categoryRepository.create({
            name: "supermarket",
            userId: "user-01"
        });

    });

    it("should be able to get user total amount by category id", async () => {
        await expenseRepository.create({
            title: "food",
            amount: new Decimal(100),
            categoryId: category.id,
            userId: "user-01",
        });

        await expenseRepository.create({
            title: "cleaning products",
            amount: new Decimal(200),
            categoryId: category.id,
            userId: "user-01",
        });

        await expenseRepository.create({
            title: "bread",
            amount: new Decimal(6.79),
            categoryId: category.id,
            userId: "user-01",
        });
        const { total } = await getTotalByCategoryIdUseCase.execute({
            userId: "user-01",
            categoryId: category.id
        });

        expect(total).toEqual(new Decimal(306.79));
    });

    it("should not be able to get the total amount if the category doesn't exist", async () => {
        await expect(
            getTotalByCategoryIdUseCase.execute({
                userId: "user-01",
                categoryId: "non-existent"
            })
        ).rejects.toBeInstanceOf(ResourceNotFoundError);
    });

    it("should not be able to get the total amount if the user id is different", async () => {
        await expect(
            getTotalByCategoryIdUseCase.execute({
                userId: "user-02",
                categoryId: category.id
            })
        ).rejects.toBeInstanceOf(NotAllowedError);
    });

    it("should not include the amount from another category in the total", async () => {
        const secondCategory = await categoryRepository.create({
            name: "health",
            userId: "user-01"
        });

        await expenseRepository.create({
            title: "gym",
            amount: new Decimal(50),
            categoryId: secondCategory.id,
            userId: "user-01"
        });

        await expenseRepository.create({
            title: "supermarket",
            amount: new Decimal(500),
            categoryId: category.id,
            userId: "user-01"
        });
        await expenseRepository.create({
            title: "supermarket",
            amount: new Decimal(100),
            categoryId: category.id,
            userId: "user-01"
        });

        const { total } = await getTotalByCategoryIdUseCase.execute({
            userId: "user-01",
            categoryId: category.id
        });

        expect(total).toEqual(new Decimal(600));
    });

    it("should return 0 if the category exists but doesn't have any amount", async () => {
        const thirdCategory = await categoryRepository.create({
            name: "leisure",
            userId: "user-01"
        });

        const { total } = await getTotalByCategoryIdUseCase.execute({
            userId: "user-01",
            categoryId: thirdCategory.id
        });

        expect(total).toEqual(new Decimal(0));
    });
}); 
