import { describe, it, expect, beforeEach } from "vitest";
import { GetTotalByCategoryIdUseCase } from "./get-total-by-category-id-use-case";
import { InMemoryExpenseRepository } from "@/repositories/in-memory/in-memory-expense-repository";
import { Decimal } from "@/generated/prisma/internal/prismaNamespace";

let expenseRepository: InMemoryExpenseRepository;
let getTotalByCategoryIdUseCase: GetTotalByCategoryIdUseCase;

describe("Get Total By Category Id Use Case", () => {
    beforeEach(() => {
        expenseRepository = new InMemoryExpenseRepository();
        getTotalByCategoryIdUseCase = new GetTotalByCategoryIdUseCase(expenseRepository);
    });

    it("should be able to get user total amount by category id", async () => {
        await expenseRepository.create({
            title: "food",
            amount: new Decimal(100),
            categoryId: "category-01",
            paidAt: new Date(),
            userId: "user-01",
            updatedAt: null
        });

        await expenseRepository.create({
            title: "cleaning products",
            amount: new Decimal(200),
            categoryId: "category-01",
            paidAt: new Date(),
            userId: "user-01",
            updatedAt: null
        });

        await expenseRepository.create({
            title: "bread",
            amount: new Decimal(6.79),
            categoryId: "category-01",
            paidAt: new Date(),
            userId: "user-01",
            updatedAt: null
        });

        const { total } = await getTotalByCategoryIdUseCase.execute({
            userId: "user-01",
            categoryId: "category-01"
        });

        expect(total).toEqual(new Decimal(306.79));
    });
});
