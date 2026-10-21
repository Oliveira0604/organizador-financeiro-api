import { InvalidDateError } from "@/errors/invalid-date-error";
import { ResourceNotFoundError } from "@/errors/resource-not-found-error";
import type { IncomeRepository } from "@/repositories/income-repository";
import type { UserRepository } from "@/repositories/user-repository";
import { resolveDate } from "@/utils/resolve-date";

interface GetTotalByUserIdUseCaseRequest {
    userId: string,
    startDate?: Date,
    endDate?: Date,
}

interface GetTotalByUserIdUseCaseResponse {
    total: number
}

export class GetTotalByUserIdUseCase {
    constructor(
        private incomeRepository: IncomeRepository,
        private userRepository: UserRepository,
    ) { }

    async execute({
        userId,
        startDate,
        endDate
    }: GetTotalByUserIdUseCaseRequest): Promise<GetTotalByUserIdUseCaseResponse> {

        const { resolvedStartDate, resolvedEndDate } = resolveDate(startDate, endDate);

        if (resolvedStartDate > resolvedEndDate) {
            throw new InvalidDateError();
        }

        const user = await this.userRepository.findById(userId);

        if (!user) {
            throw new ResourceNotFoundError();
        }

        const total = await this.incomeRepository.getTotalByUserId(
            userId,
            resolvedStartDate,
            resolvedEndDate
        );

        return {
            total
        };

    }
}