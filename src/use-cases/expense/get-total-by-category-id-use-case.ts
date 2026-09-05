import { InvalidDateError } from "@/errors/invalid-date-error";
import { NotAllowedError } from "@/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/errors/resource-not-found-error";
import type { Decimal } from "@/generated/prisma/internal/prismaNamespace";
import type { CategoryRepository } from "@/repositories/category-repository";
import type { ExpenseRepository } from "@/repositories/expense-repository";

interface GetTotalByCategoryIdUseCaseRequest {
    userId: string,
    categoryId: string,
    startDate?: Date,
    endDate?: Date
}

interface GetTotalByCategoryIdUseCaseResponse {
    total: Decimal
}

export class GetTotalByCategoryIdUseCase {
    constructor(
        private expenseRepository: ExpenseRepository,
        private categoryRepository: CategoryRepository
    ) { }

    async execute({
        userId,
        categoryId,
        startDate,
        endDate
    }: GetTotalByCategoryIdUseCaseRequest): Promise<GetTotalByCategoryIdUseCaseResponse> {

        const now = new Date();

        const resolvedStartDate = startDate ?? new Date(now.getFullYear(), now.getMonth(), 1);
        const resolvedEndDate = endDate ?? new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

        if (resolvedStartDate > resolvedEndDate) {
            throw new InvalidDateError();
        }

        const category = await this.categoryRepository.findById(categoryId);

        if (!category) {
            throw new ResourceNotFoundError();
        }

        if (category.userId !== userId) {
            throw new NotAllowedError();
        }

        const total = await this.expenseRepository.getTotalByCategoryId(
            userId,
            categoryId,
            resolvedStartDate,
            resolvedEndDate
        );

        return {
            total
        };
    }
}
