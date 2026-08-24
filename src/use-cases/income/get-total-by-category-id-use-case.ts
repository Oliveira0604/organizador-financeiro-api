import { NotAllowedError } from "@/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/errors/resource-not-found-error";
import type { Decimal } from "@/generated/prisma/internal/prismaNamespace";
import type { CategoryRepository } from "@/repositories/category-repository";
import type { IncomeRepository } from "@/repositories/income-repository";
import type { UserRepository } from "@/repositories/user-repository";

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
        private categoryRepository: CategoryRepository,
        private incomeRepository: IncomeRepository,
        private userRepository: UserRepository,
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

        const total = await this.incomeRepository.getTotalByCategoryId(
            user.id,
            category.id,
            resolvedStartDate,
            resolvedEndDate
        );

        return {
            total
        };
    }
}