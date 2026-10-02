import { InvalidDateError } from "@/errors/invalid-date-error";
import { ResourceNotFoundError } from "@/errors/resource-not-found-error";
import type { Expense, ExpenseRepository } from "@/repositories/expense-repository";
import type { UserRepository } from "@/repositories/user-repository";


interface FindManyByUserIdBetweenDatesUseCaseRequest {
    userId: string,
    startDate?: Date,
    endDate?: Date,
    page: number
}

interface FindManyByUserIdBetweenDatesUseCaseResponse {
    expenses: Expense[]
}

export class FindManyByUserIdBetweenDatesUseCase {
    constructor(
        private expenseRepository: ExpenseRepository,
        private userRepository: UserRepository
    ) { }

    async execute({
        userId,
        startDate,
        endDate,
        page
    }: FindManyByUserIdBetweenDatesUseCaseRequest): Promise<FindManyByUserIdBetweenDatesUseCaseResponse> {

        const now = new Date();

        const resolvedStartDate = startDate ?? new Date(now.getFullYear(), now.getMonth(), 1);
        const resolvedEndDate = endDate ?? new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

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