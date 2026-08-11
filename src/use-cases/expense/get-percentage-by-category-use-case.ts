import type { Decimal } from "@/generated/prisma/internal/prismaNamespace";
import type { ExpenseRepository } from "@/repositories/expense-repository";
import { getPercentage } from "@/utils/get-percentage";

interface GetPercetageByCategoryUseCaseRequest {
    userId: string,
    categoryId: string
}

interface GetPercetageByCategoryUseCaseResponse {
    percentage: Decimal
}

export class GetPercentageByCategoryUseCase {
    constructor(private expenseRepository: ExpenseRepository) { }

    async execute({
        userId,
        categoryId
    }: GetPercetageByCategoryUseCaseRequest): Promise<GetPercetageByCategoryUseCaseResponse> {
        const categoryTotal = await this.expenseRepository.getTotalByCategory(userId, categoryId);

        const userTotal = await this.expenseRepository.getTotal(userId);

        const percentage = getPercentage(userTotal, categoryTotal);

        return {
            percentage
        };
    }
}