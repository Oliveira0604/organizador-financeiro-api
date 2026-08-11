import { beforeEach, describe, expect, it } from "vitest";
import { GetPercentageByCategoryUseCase } from "./get-percentage-by-category-use-case";
import { InMemoryExpenseRepository } from "@/repositories/in-memory/in-memory-expense-repository";
import { Decimal } from "@/generated/prisma/internal/prismaNamespace";

let expenseRepository: InMemoryExpenseRepository;
let getPercentageByCategoryUseCase: GetPercentageByCategoryUseCase;

describe("Get Percentage By Category Use Case", () => {
    beforeEach(() => {
        expenseRepository = new InMemoryExpenseRepository();
        getPercentageByCategoryUseCase = new GetPercentageByCategoryUseCase(expenseRepository);
    });
    it("should be able to get the user percentage of spent by category", async () => {
        await expenseRepository.create({
            title: "supermarket",
            amount: new Decimal(100),
            categoryId: "category-01",
            userId: "user-01"
        });
        await expenseRepository.create({
            title: "supermarket",
            amount: new Decimal(200),
            categoryId: "category-01",
            userId: "user-01"
        });
        await expenseRepository.create({
            title: "bekery",
            amount: new Decimal(100),
            categoryId: "category-02",
            userId: "user-01"
        });
        await expenseRepository.create({
            title: "shopping mall",
            amount: new Decimal(100),
            categoryId: "category-03",
            userId: "user-01"
        });

        const { percentage } = await getPercentageByCategoryUseCase.execute({
            userId: "user-01",
            categoryId: "category-01"
        });

        expect(percentage).toEqual(new Decimal(60));
    });
});