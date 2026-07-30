import { InMemoryExpenseRepository } from "@/repositories/in-memory/in-memory-expense-repository";
import { describe, expect, it, beforeEach } from "vitest";
import { CreateExpenseUseCase } from "./create-expense-use-case";
import { Decimal } from "@/generated/prisma/internal/prismaNamespace";

let expenseRepository: InMemoryExpenseRepository;
let createExpenseUseCase: CreateExpenseUseCase;

describe("Create Expense Use Case", () => {
    beforeEach(() => {
        expenseRepository = new InMemoryExpenseRepository();
        createExpenseUseCase = new CreateExpenseUseCase(expenseRepository);
    });

    it("should be able to create an expense", async () => {
        const { expense } = await createExpenseUseCase.execute({
            title: "test",
            amount: new Decimal(100),
            paidAt: new Date(),
            categoryId: "1",
            userId: "1"
        });

        expect(expense.id).toEqual(expect.any(String));
    });
});