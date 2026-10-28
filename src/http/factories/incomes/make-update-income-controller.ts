import { UpdateIncomeController } from "@/http/controllers/incomes/update-income-controller";
import { PrismaIncomeRepository } from "@/repositories/prisma/prisma-income-repository";
import { PrismaUserRepository } from "@/repositories/prisma/prisma-user-repository";
import { UpdateIncomeUseCase } from "@/use-cases/income/update-income-use-case";

export function makeUpdateIncomeController() {
    const incomeRepository = new PrismaIncomeRepository();
    const userRepository = new PrismaUserRepository();
    const updateIncomeUseCase = new UpdateIncomeUseCase(incomeRepository, userRepository);
    const controller = new UpdateIncomeController(updateIncomeUseCase);

    return controller;
}