import { NotAllowedError } from "@/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/errors/resource-not-found-error";
import type { Decimal } from "@/generated/prisma/internal/prismaNamespace";
import type { CategoryRepository } from "@/repositories/category-repository";
import type { ExpenseRepository } from "@/repositories/expense-repository";

interface GetTotalByCategoryIdUseCaseRequest {
    userId: string,
    categoryId: string
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
        categoryId
    }: GetTotalByCategoryIdUseCaseRequest): Promise<GetTotalByCategoryIdUseCaseResponse> {
        const category = await this.categoryRepository.findById(categoryId);

        if (!category) {
            throw new ResourceNotFoundError();
        }

        if (category.userId !== userId) {
            throw new NotAllowedError();
        }

        const total = await this.expenseRepository.getTotalByCategory(userId, categoryId);

        return {
            total
        };
    }
}
