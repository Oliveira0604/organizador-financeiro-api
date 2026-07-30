
import type { Decimal } from "@/generated/prisma/internal/prismaNamespace";
import type { Expense, ExpenseRepository } from "@/repositories/expense-repository";

interface CreateExpenseUseCaseRequest {
    title: string,
    amount: Decimal,
    paidAt: Date,
    categoryId: string,
    userId: string,
}

interface CreateExpenseUseCaseResponse {
    expense: Expense
}

export class CreateExpenseUseCase {
    constructor(private expenseRepository: ExpenseRepository) { }

    async execute({
        title,
        amount,
        paidAt,
        categoryId,
        userId
    }: CreateExpenseUseCaseRequest): Promise<CreateExpenseUseCaseResponse> {
        const expense = await this.expenseRepository.create({
            title,
            amount,
            paidAt,
            categoryId,
            userId,
        });

        return {
            expense
        };
    }
}