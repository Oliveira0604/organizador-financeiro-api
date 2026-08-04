import { NotAllowedError } from "@/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/errors/resource-not-found-error";
import type { Decimal } from "@/generated/prisma/internal/prismaNamespace";
import type { CategoryRepository } from "@/repositories/category-repository";
import type { Expense, ExpenseRepository, UpdateExpenseData } from "@/repositories/expense-repository";

interface UpdateExpenseUseCaseRequest {
    id: string,
    userId: string,
    title?: string,
    categoryName?: string
    amount?: Decimal
}

interface UpdateExpenseUseCaseResponse {
    expense: Expense | null
}

export class UpdateExpenseUseCase {
    constructor(
        private expenseRepository: ExpenseRepository,
        private categoryRepository: CategoryRepository
    ) { }

    async execute({
        id,
        userId,
        categoryName,
        title,
        amount
    }: UpdateExpenseUseCaseRequest): Promise<UpdateExpenseUseCaseResponse> {
        const expense = await this.expenseRepository.findById(id);

        if (!expense) {
            throw new ResourceNotFoundError();
        }

        if (expense.userId !== userId) {
            throw new NotAllowedError();
        }

        const data: UpdateExpenseData = {};

        if (title) {
            data.title = title;
        }

        if (amount) {
            data.amount = amount;
        }

        if (categoryName) {
            const category = await this.categoryRepository.findByName(userId, categoryName);

            if (!category) {
                throw new ResourceNotFoundError();
            }

            data.categoryId = category.id;
        }

        const upatedExpense = await this.expenseRepository.update(
            expense.id,
            data
        );

        return {
            expense: upatedExpense
        };
    }
}