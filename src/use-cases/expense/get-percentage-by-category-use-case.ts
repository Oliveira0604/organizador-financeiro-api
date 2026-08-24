import type { Decimal } from "@/generated/prisma/internal/prismaNamespace";
import type { ExpenseRepository } from "@/repositories/expense-repository";
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
    constructor(private expenseRepository: ExpenseRepository) { }

    async execute({
        userId,
        categoryId,
        startDate,
        endDate
    }: GetPercetageByCategoryUseCaseRequest): Promise<GetPercetageByCategoryUseCaseResponse> {
        const now = new Date();

        const reolvedStartDate = startDate ?? new Date(now.getFullYear(), now.getMonth(), 1);
        const resolvedEndDate = endDate ?? new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

        const categoryTotal = await this.expenseRepository.getTotalByCategoryId(
            userId,
            categoryId,
            reolvedStartDate,
            resolvedEndDate
        );

        const userTotal = await this.expenseRepository.getTotal(userId, reolvedStartDate, resolvedEndDate);

        const percentage = getPercentage(userTotal, categoryTotal);

        return {
            percentage
        };
    }
}