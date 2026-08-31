import { InvalidDateError } from "@/errors/invalid-date-error";
import { NotAllowedError } from "@/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/errors/resource-not-found-error";
import type { CategoryRepository } from "@/repositories/category-repository";
import type { Income, IncomeRepository } from "@/repositories/income-repository";
import type { UserRepository } from "@/repositories/user-repository";

interface FindManyByCategoryIdUseCaseRequest {
    userId: string,
    categoryId: string,
    startDate?: Date,
    endDate?: Date
}

interface FindManyByCategoryIdUseCaseResponse {
    incomes: Income[]
}

export class FindManyByCategoryIdUseCase {
    constructor(
        private incomeRepository: IncomeRepository,
        private userRepository: UserRepository,
        private categoryRepository: CategoryRepository
    ) { }

    async execute({
        userId,
        categoryId,
        startDate,
        endDate
    }: FindManyByCategoryIdUseCaseRequest): Promise<FindManyByCategoryIdUseCaseResponse> {

        if (startDate && endDate && startDate > endDate) {
            throw new InvalidDateError();
        }

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

        const incomes = await this.incomeRepository.findManyByCategoryId(
            userId,
            categoryId,
            resolvedStartDate,
            resolvedEndDate
        );

        return {
            incomes
        };
    }
}