import { InvalidDateError } from "@/errors/invalid-date-error";
import { NotAllowedError } from "@/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/errors/resource-not-found-error";
import type { ExpenseRepository } from "@/repositories/expense-repository";
import type { UserRepository } from "@/repositories/user-repository";

interface GetTotalByUserIdUseCaseRequest {
    userId: string
    requesterId: string
    startDate?: Date
    endDate?: Date
}

interface GetTotalByUserIdUseCaseResponse {
    total: number
}

export class GetTotalByUserIdUseCase {
    constructor(
        private expenseRepository: ExpenseRepository,
        private userRepository: UserRepository
    ) { }

    async execute({
        userId,
        requesterId,
        startDate,
        endDate
    }: GetTotalByUserIdUseCaseRequest): Promise<GetTotalByUserIdUseCaseResponse> {
        const user = await this.userRepository.findById(userId);

        if (!user) {
            throw new ResourceNotFoundError();
        }

        if (user.id !== requesterId) {
            throw new NotAllowedError();
        }

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

        const total = await this.expenseRepository.getTotalByUserId(
            userId,
            resolvedStartDate,
            resolvedEndDate
        );

        return {
            total
        };
    }
}