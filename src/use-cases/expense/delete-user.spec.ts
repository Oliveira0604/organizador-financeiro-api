import { InMemoryExpenseRepository } from "@/repositories/in-memory/in-memory-expense-repository";
import { beforeEach, describe, expect, it } from "vitest";
import { DeleteUserUseCase } from "./delete-user-use-case";
import { Decimal } from "@/generated/prisma/internal/prismaNamespace";

let expenseRepository: InMemoryExpenseRepository;
let deleteUserUseCase: DeleteUserUseCase;

describe("Delete User Use Case", () => {
    beforeEach(() => {
        expenseRepository = new InMemoryExpenseRepository();
        deleteUserUseCase = new DeleteUserUseCase(expenseRepository);
    });

    it("should be able to soft delete an expense", async () => {
        const expense = await expenseRepository.create({
            title: "café",
            amount: new Decimal(45),
            paidAt: new Date(),
            categoryId: "category-01",
            userId: "user-01"
        });

        await deleteUserUseCase.execute({
            id: expense.id,
            userId: "user-01"
        });

        expect(expense.deletedAt).toEqual(expect.any(Date));
    });
});