import { InvalidDateError } from "@/errors/invalid-date-error";
import { ResourceNotFoundError } from "@/errors/resource-not-found-error";
import type { Income, IncomeRepository } from "@/repositories/income-repository";
import type { UserRepository } from "@/repositories/user-repository";
import { resolveDate } from "@/utils/resolve-date";

interface FindManyIncomesByUserIdUseCaseRequest {
    userId: string,
    startDate?: Date,
    endDate?: Date,
    page: number
}

interface FindManyIncomesByUserIdUseCaseResponse {
    incomes: Income[]
}

export class FindManyIncomesByUserIdUseCase {
    constructor(
        private incomeRepository: IncomeRepository,
        private userRepository: UserRepository
    ) { }

    async execute({
        userId,
        startDate,
        endDate,
        page
    }: FindManyIncomesByUserIdUseCaseRequest): Promise<FindManyIncomesByUserIdUseCaseResponse> {

        const { resolvedStartDate, resolvedEndDate } = resolveDate(startDate, endDate);

        if (resolvedStartDate > resolvedEndDate) {
            throw new InvalidDateError();
        }

        const user = await this.userRepository.findById(userId);

        if (!user) {
            throw new ResourceNotFoundError();
        }

        const incomes = await this.incomeRepository.findManyByUserIdBetweenDates(
            userId,
            resolvedStartDate,
            resolvedEndDate,
            page
        );

        return {
            incomes
        };
    }
}
