import { InvalidDateError } from "@/errors/invalid-date-error";
import { NotAllowedError } from "@/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/errors/resource-not-found-error";
import type { CategoryRepository } from "@/repositories/category-repository";
import type { Income, IncomeRepository } from "@/repositories/income-repository";
import type { UserRepository } from "@/repositories/user-repository";
import { resolveDate } from "@/utils/resolve-date";

interface FindManyByCategoryIdUseCaseRequest {
    userId: string,
    categoryId: string,
    startDate?: Date,
    endDate?: Date
    page: number
}

interface FindManyByCategoryIdUseCaseResponse {
    incomes: Income[]
}

export class FindManyIncomesByCategoryIdUseCase {
    constructor(
        private incomeRepository: IncomeRepository,
        private userRepository: UserRepository,
        private categoryRepository: CategoryRepository
    ) { }

    async execute({
        userId,
        categoryId,
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

        const incomes = await this.incomeRepository.findManyByCategoryId(
            userId,
            categoryId,
            resolvedStartDate,
            resolvedEndDate,
            page
        );

        return {
            incomes
        };
    }
}