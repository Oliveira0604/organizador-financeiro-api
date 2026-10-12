import { GetPercentageByCategoryController } from "@/http/controllers/expenses/get-percentage-by-category-contoller";
import { PrismaCategoryRepository } from "@/repositories/prisma/prisma-category-repository";
import { PrismaExpenseRepository } from "@/repositories/prisma/prisma-expense-repository";
import { PrismaUserRepository } from "@/repositories/prisma/prisma-user-repository";
import { GetPercentageByCategoryUseCase } from "@/use-cases/expense/get-percentage-by-category-use-case";

export function makeGetPercentageByCategoryController() {
    const expenseRepository = new PrismaExpenseRepository();
    const categoryRepository = new PrismaCategoryRepository();
    const userRepository = new PrismaUserRepository();
    const getPecentageByCategoryUseCase = new GetPercentageByCategoryUseCase(expenseRepository, categoryRepository, userRepository);
    const controller = new GetPercentageByCategoryController(getPecentageByCategoryUseCase);

    return controller;
}