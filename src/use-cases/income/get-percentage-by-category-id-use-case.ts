import { InvalidDateError } from "@/errors/invalid-date-error";
import { NotAllowedError } from "@/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/errors/resource-not-found-error";
import type { CategoryRepository } from "@/repositories/category-repository";
import type { IncomeRepository } from "@/repositories/income-repository";
import { getPercentage } from "@/utils/get-percentage";
import { resolveDate } from "@/utils/resolve-date";

interface GetPercentageByCategoryIdUseCaseRequest {
    userId: string
    categoryId: string,
    startDate?: Date,
    endDate?: Date
}

interface GetPercentageByCategoryIdUseCaseResponse {
    percentage: number
}

export class GetPercentageByCategoryIdUseCase {
    constructor(
        private categoryRepository: CategoryRepository,
        private incomeRepository: IncomeRepository
    ) { }

    async execute({
        userId,
        categoryId,
        startDate,
        endDate
    }: GetPercentageByCategoryIdUseCaseRequest): Promise<GetPercentageByCategoryIdUseCaseResponse> {
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

        console.time("Sequencial");
        const categoryTotal = await this.incomeRepository.getTotalByCategoryId(
            userId,
            category.id,
            resolvedStartDate,
            resolvedEndDate
        );

        const userTotal = await this.incomeRepository.getTotal(
            userId,
            resolvedStartDate,
            resolvedEndDate
        );
        console.timeEnd("Sequencial");

        const percentage = getPercentage(
            userTotal,
            categoryTotal
        );

        return {
            percentage
        };
    }
}
//TODO: Finish this use case and make the test