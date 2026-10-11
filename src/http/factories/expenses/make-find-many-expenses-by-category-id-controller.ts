import { FindManyExpensesByCategoryIdController } from "@/http/controllers/expenses/find-many-by-category-id-controller";
import { PrismaCategoryRepository } from "@/repositories/prisma/prisma-category-repository";
import { PrismaExpenseRepository } from "@/repositories/prisma/prisma-expense-repository";
import { PrismaUserRepository } from "@/repositories/prisma/prisma-user-repository";
import { FindManyExpensesByCategoryIdUseCase } from "@/use-cases/expense/find-many-expenses-by-category-id-use-case";

export function makeFindManyExpensesByCategoryIdController() {
    const userRepository = new PrismaUserRepository();
    const categoryRepository = new PrismaCategoryRepository();
    const expenseRepository = new PrismaExpenseRepository();
    const findManyByCategoryIdUseCase = new FindManyExpensesByCategoryIdUseCase(expenseRepository, categoryRepository, userRepository);
    const controller = new FindManyExpensesByCategoryIdController(findManyByCategoryIdUseCase);

    return controller;
}