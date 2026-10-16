import { GetTotalByCategoryIdController } from "@/http/controllers/incomes/get-total-by-category-id-controller";
import { PrismaCategoryRepository } from "@/repositories/prisma/prisma-category-repository";
import { PrismaIncomeRepository } from "@/repositories/prisma/prisma-income-repository";
import { PrismaUserRepository } from "@/repositories/prisma/prisma-user-repository";
import { GetTotalByCategoryIdUseCase } from "@/use-cases/income/get-total-by-category-id-use-case";

export function makeGetTotalByCategoryIdController() {
    const categoryRepository = new PrismaCategoryRepository();
    const incomeRepository = new PrismaIncomeRepository();
    const userRepository = new PrismaUserRepository();
    const getTotalByCategoryIdUseCase = new GetTotalByCategoryIdUseCase(categoryRepository, incomeRepository, userRepository);
    const controller = new GetTotalByCategoryIdController(getTotalByCategoryIdUseCase);

    return controller;
}