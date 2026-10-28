import { DeleteIncomeController } from "@/http/controllers/incomes/delete-income-controller";
import { PrismaIncomeRepository } from "@/repositories/prisma/prisma-income-repository";
import { DeleteIncomeUseCase } from "@/use-cases/income/delete-income-use-case";

export function makeDeleteIncomeController() {
    const incomeRepository = new PrismaIncomeRepository();
    const deleteIncomeUseCase = new DeleteIncomeUseCase(incomeRepository);
    const controller = new DeleteIncomeController(deleteIncomeUseCase);

    return controller;
}