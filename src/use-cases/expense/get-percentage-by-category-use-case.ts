import { InvalidDateError } from "@/errors/invalid-date-error";
import { NotAllowedError } from "@/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/errors/resource-not-found-error";
import type { Decimal } from "@/generated/prisma/internal/prismaNamespace";
import type { CategoryRepository } from "@/repositories/category-repository";
import type { ExpenseRepository } from "@/repositories/expense-repository";
import type { UserRepository } from "@/repositories/user-repository";
import { getPercentage } from "@/utils/get-percentage";

interface GetPercetageByCategoryUseCaseRequest {
    userId: string,
    categoryId: string,
    startDate?: Date,
    endDate?: Date
}

interface GetPercetageByCategoryUseCaseResponse {
    percentage: Decimal
}

export class GetPercentageByCategoryUseCase {
    constructor(
        private expenseRepository: ExpenseRepository,
        private categoryRepository: CategoryRepository,
        private userRepository: UserRepository
    ) { }

    async execute({
        userId,
        categoryId,
        startDate,
        endDate
    }: GetPercetageByCategoryUseCaseRequest): Promise<GetPercetageByCategoryUseCaseResponse> {

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

        if (category.userId !== user.id) {
            throw new NotAllowedError();
        }

        const categoryTotal = await this.expenseRepository.getTotalByCategoryId(
            user.id,
            category.id,
            resolvedStartDate,
            resolvedEndDate
        );

        const userTotal = await this.expenseRepository.getTotal(user.id, resolvedStartDate, resolvedEndDate);

        const percentage = getPercentage(userTotal, categoryTotal);

        return {
            percentage
        };
    }
}