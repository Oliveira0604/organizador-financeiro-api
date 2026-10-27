import { GetPercentageByCategoryIdController } from "@/http/controllers/incomes/get-percentage-by-category-id-controller";
import { PrismaCategoryRepository } from "@/repositories/prisma/prisma-category-repository";
import { PrismaIncomeRepository } from "@/repositories/prisma/prisma-income-repository";
import { GetPercentageByCategoryIdUseCase } from "@/use-cases/income/get-percentage-by-category-id-use-case";

export function makeGetPercentageByCategoryIdController() {
    const categoryRepository = new PrismaCategoryRepository();
    const incomeRepository = new PrismaIncomeRepository();
    const getPercentageByCategoryIdUseCase = new GetPercentageByCategoryIdUseCase(categoryRepository, incomeRepository);
    const controller = new GetPercentageByCategoryIdController(getPercentageByCategoryIdUseCase);

    return controller;
}