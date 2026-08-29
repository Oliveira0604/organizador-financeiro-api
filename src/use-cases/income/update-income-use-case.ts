import { InvalidDateError } from "@/errors/invalid-date-error";
import { InvalidStringError } from "@/errors/invalid-string-error";
import { InvalidAmountError } from "@/errors/is-amount-valid-error";
import { NotAllowedError } from "@/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/errors/resource-not-found-error";
import type { Decimal } from "@/generated/prisma/internal/prismaNamespace";
import type { Income, IncomeRepository, UpdateIncomeData } from "@/repositories/income-repository";
import type { UserRepository } from "@/repositories/user-repository";
import { isValidAmount } from "@/utils/is-valid-amount";

interface UpdateIncomeUseCaseRequest {
    userId: string,
    incomeId: string,
    title?: string,
    amount?: Decimal,
    receivedAt?: Date

}

interface UpdateIncomeUseCaseResponse {
    income: Income
}

export class UpdateIncomeUseCase {
    constructor(
        private incomeRepository: IncomeRepository,
        private userRepository: UserRepository
    ) { }

    async execute({
        userId,
        incomeId,
        title,
        amount,
        receivedAt
    }: UpdateIncomeUseCaseRequest): Promise<UpdateIncomeUseCaseResponse> {
        const user = await this.userRepository.findById(userId);

        if (!user) {
            throw new ResourceNotFoundError();
        }

        const income = await this.incomeRepository.findById(incomeId);

        if (!income) {
            throw new ResourceNotFoundError();
        }

        if (income.userId !== userId) {
            throw new NotAllowedError();
        }

        const data: UpdateIncomeData = {};

        if (title !== undefined) {
            if (title.trim() === "") {
                throw new InvalidStringError("title");
            }
            data.title = title;
        }

        if (amount !== undefined) {
            if (!isValidAmount(amount)) {
                throw new InvalidAmountError();
            }
            data.amount = amount;
        }

        if (receivedAt !== undefined) {
            if (isNaN(receivedAt.getTime())) {
                throw new InvalidDateError();
            }
            data.receivedAt = receivedAt;
        }

        const updatedIncome = await this.incomeRepository.update(
            income.id,
            data
        );

        return {
            income: updatedIncome
        };

    }
}
