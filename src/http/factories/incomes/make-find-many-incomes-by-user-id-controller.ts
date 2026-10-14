import { FindManyIncomesByUserIdController } from "@/http/controllers/incomes/find-many-incomes-by-user-id-controller";
import { PrismaIncomeRepository } from "@/repositories/prisma/prisma-income-repository";
import { PrismaUserRepository } from "@/repositories/prisma/prisma-user-repository";
import { FindManyIncomesByUserIdUseCase } from "@/use-cases/income/find-many-incomes-by-user-id-use-case";

export function makeFindManyIncomesByUserIdController() {
    const incomeRepository = new PrismaIncomeRepository();
    const userRespository = new PrismaUserRepository();
    const findManyIncomesByUserIdUseCase = new FindManyIncomesByUserIdUseCase(incomeRepository, userRespository);
    const controller = new FindManyIncomesByUserIdController(findManyIncomesByUserIdUseCase);

    return controller;
}