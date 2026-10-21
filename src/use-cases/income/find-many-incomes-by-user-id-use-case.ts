import { InvalidDateError } from "@/errors/invalid-date-error";
import { ResourceNotFoundError } from "@/errors/resource-not-found-error";
import type { Income, IncomeRepository } from "@/repositories/income-repository";
import type { UserRepository } from "@/repositories/user-repository";

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

        const now = new Date();

        const resolvedStartDate = startDate
            ? new Date(startDate.setHours(0, 0, 0, 0))
            : new Date(now.getFullYear(), now.getMonth(), 1);
        const resolvedEndDate = endDate
            ? new Date(endDate.setHours(23, 59, 59, 999))
            : new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);


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
