import { ResourceNotFoundError } from "@/errors/resource-not-found-error";
import type { Expense, ExpenseRepository } from "@/repositories/expense-repository";
import type { UserRepository } from "@/repositories/user-repository";


interface FindManyByUserIdBetweenDatesUseCaseRequest {
    userId: string,
    startDate: Date,
    endDate: Date
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
        endDate
    }: FindManyByUserIdBetweenDatesUseCaseRequest): Promise<FindManyByUserIdBetweenDatesUseCaseResponse> {
        const user = await this.userRepository.findById(userId);

        if (!user) {
            throw new ResourceNotFoundError();
        }

        const expenses = await this.expenseRepository.findManyByUserIdBetweenDates(
            userId,
            startDate,
            endDate
        );

        return {
            expenses
        };
    }
}