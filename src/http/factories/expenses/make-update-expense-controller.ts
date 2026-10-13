import { UpdateExpenseController } from "@/http/controllers/expenses/update-expense-controller";
import { PrismaCategoryRepository } from "@/repositories/prisma/prisma-category-repository";
import { PrismaExpenseRepository } from "@/repositories/prisma/prisma-expense-repository";
import { UpdateExpenseUseCase } from "@/use-cases/expense/update-expense-use-case";

export function makeUpdateExpenseController() {
    const expenseRepository = new PrismaExpenseRepository();
    const categoryRepository = new PrismaCategoryRepository();
    const updateExpenseUseCase = new UpdateExpenseUseCase(expenseRepository, categoryRepository);
    const controller = new UpdateExpenseController(updateExpenseUseCase);

    return controller;
}