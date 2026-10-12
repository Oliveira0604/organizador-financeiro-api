import { GetTotalByCategoryIdController } from "@/http/controllers/expenses/get-total-by-category-id-controller";
import { PrismaCategoryRepository } from "@/repositories/prisma/prisma-category-repository";
import { PrismaExpenseRepository } from "@/repositories/prisma/prisma-expense-repository";
import { GetTotalByCategoryIdUseCase } from "@/use-cases/expense/get-total-by-category-id-use-case";

export function makeGetTotalByCategoryIdController() {
    const expenseRepository = new PrismaExpenseRepository();
    const categoryRepository = new PrismaCategoryRepository();
    const getTotalByCategoryIdUseCase = new GetTotalByCategoryIdUseCase(expenseRepository, categoryRepository);
    const controller = new GetTotalByCategoryIdController(getTotalByCategoryIdUseCase);

    return controller;
}