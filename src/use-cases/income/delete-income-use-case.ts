import { NotAllowedError } from "@/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/errors/resource-not-found-error";
import type { IncomeRepository } from "@/repositories/income-repository";

interface DeleteIncomeUseCaseRequest {
    incomeId: string,
    userId: string
}

export class DeleteIncomeUseCase {
    constructor(
        private incomeRepository: IncomeRepository,
    ) { }

    async execute({
        incomeId,
        userId
    }: DeleteIncomeUseCaseRequest): Promise<void> {
        const income = await this.incomeRepository.findById(incomeId);

        if (!income) {
            throw new ResourceNotFoundError();
        }

        if (income.userId !== userId) {
            throw new NotAllowedError();
        }

        await this.incomeRepository.delete(income.id);

    }
}