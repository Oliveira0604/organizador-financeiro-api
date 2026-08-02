import type { Expense, ExpenseRepository } from "@/repositories/expense-repository";

interface FindManyByCategoryIdUseCaseRequest {
    categoryId: string
}

interface FindManyByCategoryIdUseCaseResponse {
    expenses: Expense[]
}

export class FindManyByCategoryIdUseCase {
    constructor(private expenseRepository: ExpenseRepository) { }

    async execute({
        categoryId,
    }: FindManyByCategoryIdUseCaseRequest): Promise<FindManyByCategoryIdUseCaseResponse> {
        const expenses = await this.expenseRepository.findManyByCategoryId(categoryId);

        return {
            expenses,
        };
    }
}