import { NotAllowedError } from "@/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/errors/resource-not-found-error";
import type { ExpenseRepository } from "@/repositories/expense-repository";

interface DeleteUserUseCaseRequest {
    id: string
    userId: string
}

export class DeleteUserUseCase {
    constructor(private expenseRepository: ExpenseRepository) { }

    async execute({
        id,
        userId
    }: DeleteUserUseCaseRequest): Promise<void> {
        const expense = await this.expenseRepository.findById(id);

        if (!expense) {
            throw new ResourceNotFoundError();
        }

        if (expense.userId != userId) {
            throw new NotAllowedError();
        }

        await this.expenseRepository.delete(id);

    }
}