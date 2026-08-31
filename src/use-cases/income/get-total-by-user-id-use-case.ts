import { InvalidDateError } from "@/errors/invalid-date-error";
import { ResourceNotFoundError } from "@/errors/resource-not-found-error";
import { Decimal } from "@/generated/prisma/internal/prismaNamespace";
import type { IncomeRepository } from "@/repositories/income-repository";
import type { UserRepository } from "@/repositories/user-repository";

interface GetTotalByUserIdUseCaseRequest {
    userId: string,
    startDate?: Date,
    endDate?: Date,
}

interface GetTotalByUserIdUseCaseResponse {
    total: Decimal
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