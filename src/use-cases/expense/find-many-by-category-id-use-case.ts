import { InvalidDateError } from "@/errors/invalid-date-error";
import { NotAllowedError } from "@/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/errors/resource-not-found-error";
import type { CategoryRepository } from "@/repositories/category-repository";
import type { Expense, ExpenseRepository } from "@/repositories/expense-repository";
import type { UserRepository } from "@/repositories/user-repository";

interface FindManyByCategoryIdUseCaseRequest {
    categoryId: string,
    userId: string,
    startDate?: Date,
    endDate?: Date
}

interface FindManyByCategoryIdUseCaseResponse {
    expenses: Expense[]
}

export class FindManyByCategoryIdUseCase {
    constructor(
        private expenseRepository: ExpenseRepository,
        private categoryRepository: CategoryRepository,
        private userRepository: UserRepository
    ) { }

    async execute({
        categoryId,
        userId,
        startDate,
        endDate
    }: FindManyByCategoryIdUseCaseRequest): Promise<FindManyByCategoryIdUseCaseResponse> {

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

        const category = await this.categoryRepository.findById(categoryId);

        if (!category) {
            throw new ResourceNotFoundError();
        }

        if (category.userId !== userId) {
            throw new NotAllowedError();
        }

        const expenses = await this.expenseRepository.findManyByCategoryId(category.id, resolvedStartDate, resolvedEndDate);

        return {
            expenses,
        };
    }
}