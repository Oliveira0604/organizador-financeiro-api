import { FindManyExpensesByUserIdBetweenDatesController } from "@/http/controllers/expenses/find-many-expenses-by-user-id-between-dates-controller";
import { PrismaExpenseRepository } from "@/repositories/prisma/prisma-expense-repository";
import { PrismaUserRepository } from "@/repositories/prisma/prisma-user-repository";
import { FindManyExpensesByUserIdBetweenDatesUseCase } from "@/use-cases/expense/find-many-expenses-by-user-id-between-dates-use-case";

export function makeFindManyByUserIdBetweenDatesController() {
    const expenseRepository = new PrismaExpenseRepository();
    const userRepository = new PrismaUserRepository();
    const findManyExpensesByUserIdBetweenDatesUseCase = new FindManyExpensesByUserIdBetweenDatesUseCase(expenseRepository, userRepository);
    const controller = new FindManyExpensesByUserIdBetweenDatesController(findManyExpensesByUserIdBetweenDatesUseCase);

    return controller;
}