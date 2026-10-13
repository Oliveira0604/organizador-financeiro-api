import { CreateIncomeController } from "@/http/controllers/incomes/create-income-controller";
import { PrismaCategoryRepository } from "@/repositories/prisma/prisma-category-repository";
import { PrismaIncomeRepository } from "@/repositories/prisma/prisma-income-repository";
import { CreateIncomeUseCase } from "@/use-cases/income/create-income-use-case";

export function makeCreateIncomeController() {
    const incomeRepository = new PrismaIncomeRepository();
    const categoryRepository = new PrismaCategoryRepository();
    const createIncomeUseCase = new CreateIncomeUseCase(incomeRepository, categoryRepository);
    const controller = new CreateIncomeController(createIncomeUseCase);

    return controller;
}