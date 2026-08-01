import type { Expense, ExpenseRepository } from "@/repositories/expense-repository";


interface FindManyByUserIdBetweenDatesUseCaseRequest {
    userId: string,
    startDate: Date,
    endDate: Date
}

interface FindManyByUserIdBetweenDatesUseCaseResponse {
    expenses: Expense[]
}

export class FindManyByUserIdBetweenDatesUseCase {
    constructor(private expenseRepository: ExpenseRepository) { }

    async execute({
        userId,
        startDate,
        endDate
    }: FindManyByUserIdBetweenDatesUseCaseRequest): Promise<FindManyByUserIdBetweenDatesUseCaseResponse> {
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