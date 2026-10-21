import { InvalidDateError } from "@/errors/invalid-date-error";
import { NotAllowedError } from "@/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/errors/resource-not-found-error";
import type { CategoryRepository } from "@/repositories/category-repository";
import type { Expense, ExpenseRepository } from "@/repositories/expense-repository";
import type { UserRepository } from "@/repositories/user-repository";
import { resolveDate } from "@/utils/resolve-date";

interface FindManyByCategoryIdUseCaseRequest {
    categoryId: string,
    userId: string,
    startDate?: Date,
    endDate?: Date,
    page: number
}

interface FindManyByCategoryIdUseCaseResponse {
    expenses: Expense[]
}

export class FindManyExpensesByCategoryIdUseCase {
    constructor(
        private expenseRepository: ExpenseRepository,
        private categoryRepository: CategoryRepository,
        private userRepository: UserRepository
    ) { }

    async execute({
        categoryId,
        userId,
        startDate,
        endDate,
        page
    }: FindManyByCategoryIdUseCaseRequest): Promise<FindManyByCategoryIdUseCaseResponse> {

        const { resolvedStartDate, resolvedEndDate } = resolveDate(startDate, endDate);

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

        const expenses = await this.expenseRepository.findManyByCategoryId(category.id, resolvedStartDate, resolvedEndDate, page);

        return {
            expenses,
        };
    }
}