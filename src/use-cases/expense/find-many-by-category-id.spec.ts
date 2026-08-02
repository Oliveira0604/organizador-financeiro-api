import { InMemoryExpenseRepository } from "@/repositories/in-memory/in-memory-expense-repository";
import { beforeEach, describe, expect, it } from "vitest";
import { FindManyByCategoryIdUseCase } from "./find-many-by-category-id-use-case";
import { Decimal } from "@/generated/prisma/internal/prismaNamespace";

let expenseRepository: InMemoryExpenseRepository;
let findManyByCategoryId: FindManyByCategoryIdUseCase;

describe("Find Many By Category Id Use Case", () => {
    beforeEach(() => {
        expenseRepository = new InMemoryExpenseRepository();
        findManyByCategoryId = new FindManyByCategoryIdUseCase(expenseRepository);
    });

    it("should be able to get the category expenses", async () => {
        await expenseRepository.create({
            title: "supermarket",
            amount: new Decimal(100),
            categoryId: "category-01",
            paidAt: new Date(),
            userId: "user-01",
            updatedAt: null
        });

        await expenseRepository.create({
            title: "supermarket",
            amount: new Decimal(200),
            categoryId: "category-01",
            paidAt: new Date(),
            userId: "user-01",
            updatedAt: null
        });

        const { expenses } = await findManyByCategoryId.execute({
            categoryId: "category-01"
        });

        expect(expenses).toHaveLength(2);
    });
});