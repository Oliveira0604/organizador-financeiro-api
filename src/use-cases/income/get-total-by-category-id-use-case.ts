import { InvalidDateError } from "@/errors/invalid-date-error";
import { NotAllowedError } from "@/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/errors/resource-not-found-error";
import type { CategoryRepository } from "@/repositories/category-repository";
import type { IncomeRepository } from "@/repositories/income-repository";
import type { UserRepository } from "@/repositories/user-repository";
import { resolveDate } from "@/utils/resolve-date";

interface GetTotalByCategoryIdUseCaseRequest {
    userId: string,
    categoryId: string,
    startDate?: Date,
    endDate?: Date
}

interface GetTotalByCategoryIdUseCaseResponse {
    total: number
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

        const { resolvedStartDate, resolvedEndDate } = resolveDate(startDate, endDate);

        if (resolvedStartDate > resolvedEndDate) {
            throw new InvalidDateError();
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