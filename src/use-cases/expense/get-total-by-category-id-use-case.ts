import type { Decimal } from "@/generated/prisma/internal/prismaNamespace";
import type { ExpenseRepository } from "@/repositories/expense-repository";

interface GetTotalByCategoryIdUseCaseRequest {
    userId: string,
    categoryId: string
}

interface GetTotalByCategoryIdUseCaseResponse {
    total: Decimal
}

export class GetTotalByCategoryIdUseCase {
    constructor(private expenseRepository: ExpenseRepository) { }

    async execute({
        userId,
        categoryId
    }: GetTotalByCategoryIdUseCaseRequest): Promise<GetTotalByCategoryIdUseCaseResponse> {
        const total = await this.expenseRepository.getTotalByCategory(userId, categoryId);

        return {
            total
        };


    }
}