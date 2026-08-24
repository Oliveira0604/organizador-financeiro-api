import { ResourceNotFoundError } from "@/errors/resource-not-found-error";
import type { Income, IncomeRepository } from "@/repositories/income-repository";
import type { UserRepository } from "@/repositories/user-repository";

interface FindManyByUserIdBetweenDatesUseCaseRequest {
    userId: string,
    startDate?: Date,
    endDate?: Date
}

interface FindManyByUserIdBetweenDatesUseCaseResponse {
    incomes: Income[]
}

export class FindManyByUserIdBetweenDatesUseCase {
    constructor(
        private incomeRepository: IncomeRepository,
        private userRepository: UserRepository
    ) { }

    async execute({
        userId,
        startDate,
        endDate
    }: FindManyByUserIdBetweenDatesUseCaseRequest): Promise<FindManyByUserIdBetweenDatesUseCaseResponse> {

        const now = new Date();

        const resolvedStartDate = startDate ?? new Date(now.getFullYear(), now.getMonth(), 1);
        const resolvedEndDate = endDate ?? new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

        const user = await this.userRepository.findById(userId);

        if (!user) {
            throw new ResourceNotFoundError();
        }

        const incomes = await this.incomeRepository.findManyByUserIdBetweenDates(
            userId,
            resolvedStartDate,
            resolvedEndDate
        );

        return {
            incomes
        };
    }
}
