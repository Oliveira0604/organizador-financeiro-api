import { NotAllowedError } from "@/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/errors/resource-not-found-error";
import type { CategoryRepository } from "@/repositories/category-repository";
import type { Expense, ExpenseRepository } from "@/repositories/expense-repository";

interface FindManyByCategoryIdUseCaseRequest {
    categoryId: string,
    userId: string
}

interface FindManyByCategoryIdUseCaseResponse {
    expenses: Expense[]
}

export class FindManyByCategoryIdUseCase {
    constructor(
        private expenseRepository: ExpenseRepository,
        private categoryRepository: CategoryRepository
    ) { }

    async execute({
        categoryId,
        userId
    }: FindManyByCategoryIdUseCaseRequest): Promise<FindManyByCategoryIdUseCaseResponse> {
        const category = await this.categoryRepository.findById(categoryId);

        if (!category) {
            throw new ResourceNotFoundError();
        }

        if (category.userId !== userId) {
            throw new NotAllowedError();
        }

        const expenses = await this.expenseRepository.findManyByCategoryId(category.id);

        return {
            expenses,
        };
    }
}