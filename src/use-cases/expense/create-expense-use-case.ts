
import { InvalidAmountError } from "@/errors/is-amount-valid-error";
import { NotAllowedError } from "@/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/errors/resource-not-found-error";
import type { Decimal } from "@/generated/prisma/internal/prismaNamespace";
import type { CategoryRepository } from "@/repositories/category-repository";
import type { Expense, ExpenseRepository } from "@/repositories/expense-repository";
import { isValidAmount } from "@/utils/is-valid-amount";

interface CreateExpenseUseCaseRequest {
    title: string,
    amount: Decimal,
    categoryId: string,
    userId: string,
}

interface CreateExpenseUseCaseResponse {
    expense: Expense
}

export class CreateExpenseUseCase {
    constructor(
        private expenseRepository: ExpenseRepository,
        private categoryRepository: CategoryRepository
    ) { }

    async execute({
        title,
        amount,
        categoryId,
        userId
    }: CreateExpenseUseCaseRequest): Promise<CreateExpenseUseCaseResponse> {
        const category = await this.categoryRepository.findById(categoryId);

        if (!category) {
            throw new ResourceNotFoundError();
        }
        if (category.userId !== userId) {
            throw new NotAllowedError();
        }

        if (!isValidAmount(amount)) {
            throw new InvalidAmountError();
        }

        const expense = await this.expenseRepository.create({
            title,
            amount,
            categoryId,
            userId,
        });

        return {
            expense
        };
    }
}