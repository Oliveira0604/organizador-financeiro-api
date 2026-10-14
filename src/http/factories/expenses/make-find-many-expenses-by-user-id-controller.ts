import { FindManyExpensesByUserIdController } from "@/http/controllers/expenses/find-many-expenses-by-user-id-between-dates-controller";
import { PrismaExpenseRepository } from "@/repositories/prisma/prisma-expense-repository";
import { PrismaUserRepository } from "@/repositories/prisma/prisma-user-repository";
import { FindManyExpensesByUserIdUseCase } from "@/use-cases/expense/find-many-expenses-by-user-id-use-case";

export function makeFindExpensesManyByUserController() {
    const expenseRepository = new PrismaExpenseRepository();
    const userRepository = new PrismaUserRepository();
    const findManyExpensesByUserIdUseCase = new FindManyExpensesByUserIdUseCase(expenseRepository, userRepository);
    const controller = new FindManyExpensesByUserIdController(findManyExpensesByUserIdUseCase);

    return controller;
}