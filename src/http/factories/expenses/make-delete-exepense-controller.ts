import { DeleteExpenseController } from "@/http/controllers/expenses/delete-expense-controller";
import { PrismaExpenseRepository } from "@/repositories/prisma/prisma-expense-repository";
import { DeleteExpenseUseCase } from "@/use-cases/expense/delete-expense-use-case";

export function makeDeleteExpenseController() {
    const expenseRepository = new PrismaExpenseRepository();
    const deleteExpenseUseCase = new DeleteExpenseUseCase(expenseRepository);
    const controller = new DeleteExpenseController(deleteExpenseUseCase);

    return controller;
}