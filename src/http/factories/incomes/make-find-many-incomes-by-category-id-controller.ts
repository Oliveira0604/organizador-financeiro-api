import { FindManyIncomesByCategoryIdController } from "@/http/controllers/incomes/find-many-incomes-by-category-id-controller";
import { PrismaCategoryRepository } from "@/repositories/prisma/prisma-category-repository";
import { PrismaIncomeRepository } from "@/repositories/prisma/prisma-income-repository";
import { PrismaUserRepository } from "@/repositories/prisma/prisma-user-repository";
import { FindManyIncomesByCategoryIdUseCase } from "@/use-cases/income/find-many-incomes-by-category-id-use-case";

export function makeFindManyIncomesByCategoryIdController() {
    const incomeRepository = new PrismaIncomeRepository();
    const userRepository = new PrismaUserRepository();
    const categoryRepository = new PrismaCategoryRepository();
    const findManyIncomesByCategoryIdUseCase = new FindManyIncomesByCategoryIdUseCase(incomeRepository, userRepository, categoryRepository);
    const controller = new FindManyIncomesByCategoryIdController(findManyIncomesByCategoryIdUseCase);

    return controller;
}