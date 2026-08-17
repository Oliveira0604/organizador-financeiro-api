import { InMemoryExpenseRepository } from "@/repositories/in-memory/in-memory-expense-repository";
import { beforeEach, describe, expect, it } from "vitest";
import { DeleteExpenseUseCase } from "./delete-expense-use-case";
import { Decimal } from "@/generated/prisma/internal/prismaNamespace";
import type { Expense } from "@/repositories/expense-repository";
import { ResourceNotFoundError } from "@/errors/resource-not-found-error";
import { NotAllowedError } from "@/errors/not-allowed-error";

let expenseRepository: InMemoryExpenseRepository;
let deleteExpenseUseCase: DeleteExpenseUseCase;
let expense: Expense;

describe("Delete Expense Use Case", () => {
    beforeEach(async () => {
        expenseRepository = new InMemoryExpenseRepository();
        deleteExpenseUseCase = new DeleteExpenseUseCase(expenseRepository);

        expense = await expenseRepository.create({
            title: "café",
            amount: new Decimal(45),
            categoryId: "category-01",
            userId: "user-01"
        });
    });

    it("should be able to soft delete an expense", async () => {
        await deleteExpenseUseCase.execute({
            id: expense.id,
            userId: "user-01"
        });

        const deletedExpense = await expenseRepository.findById(expense.id);

        expect(deletedExpense?.deletedAt).toEqual(expect.any(Date));
    });

    it("should not delete if the expense doesn't exist", async () => {
        await expect(
            deleteExpenseUseCase.execute({
                id: "non-existent",
                userId: "user-01"
            })
        ).rejects.toBeInstanceOf(ResourceNotFoundError);
    });

    it("should not delete if the user id is different", async () => {
        await expect(
            deleteExpenseUseCase.execute({
                id: expense.id,
                userId: "user-02"
            })
        ).rejects.toBeInstanceOf(NotAllowedError);
    });
});
