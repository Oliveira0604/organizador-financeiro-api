import { GetTotalByUserIdController } from "@/http/controllers/incomes/get-total-by-user-id-controller";
import { PrismaIncomeRepository } from "@/repositories/prisma/prisma-income-repository";
import { PrismaUserRepository } from "@/repositories/prisma/prisma-user-repository";
import { GetTotalByUserIdUseCase } from "@/use-cases/income/get-total-by-user-id-use-case";

export function makeGetTotalByUserIdController() {
    const incomeRepository = new PrismaIncomeRepository();
    const userRepository = new PrismaUserRepository();
    const getTotalByUserIdUseCase = new GetTotalByUserIdUseCase(incomeRepository, userRepository);
    const controller = new GetTotalByUserIdController(getTotalByUserIdUseCase);

    return controller;
}