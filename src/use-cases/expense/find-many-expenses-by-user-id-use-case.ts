import { InvalidDateError } from "@/errors/invalid-date-error";
import { ResourceNotFoundError } from "@/errors/resource-not-found-error";
import type { Expense, ExpenseRepository } from "@/repositories/expense-repository";
import type { UserRepository } from "@/repositories/user-repository";
import { resolveDate } from "@/utils/resolve-date";


interface FindManyExpensesByUserIdUseCaseRequest {
    userId: string,
    startDate?: Date,
    endDate?: Date,
    page: number
}

interface FindManyExpensesByUserIdUseCaseResponse {
    expenses: Expense[]
}

export class FindManyExpensesByUserIdUseCase {
    constructor(
        private expenseRepository: ExpenseRepository,
        private userRepository: UserRepository
    ) { }

    async execute({
        userId,
        startDate,
        endDate,
        page
    }: FindManyExpensesByUserIdUseCaseRequest): Promise<FindManyExpensesByUserIdUseCaseResponse> {

        const { resolvedStartDate, resolvedEndDate } = resolveDate(startDate, endDate);

        if (resolvedStartDate > resolvedEndDate) {
            throw new InvalidDateError();
        }

        const user = await this.userRepository.findById(userId);

        if (!user) {
            throw new ResourceNotFoundError();
        }

        const expenses = await this.expenseRepository.findManyByUserIdBetweenDates(
            userId,
            resolvedStartDate,
            resolvedEndDate,
            page
        );

        return {
            expenses
        };
    }
}