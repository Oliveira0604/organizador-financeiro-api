import { CreateExpenseController } from "@/http/controllers/expenses/create-expense-controller";
import { PrismaCategoryRepository } from "@/repositories/prisma/prisma-category-repository";
import { PrismaExpenseRepository } from "@/repositories/prisma/prisma-expense-repository";
import { CreateExpenseUseCase } from "@/use-cases/expense/create-expense-use-case";

export function makeCreateExpenseController() {
    const expenseRepository = new PrismaExpenseRepository();
    const categoryRepository = new PrismaCategoryRepository();
    const createExpenseUseCase = new CreateExpenseUseCase(expenseRepository, categoryRepository);
    const controller = new CreateExpenseController(createExpenseUseCase);

    return controller;
}