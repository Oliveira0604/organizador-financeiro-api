import { InvalidStringError } from "@/errors/invalid-string-error";
import { InvalidAmountError } from "@/errors/is-amount-valid-error";
import { NotAllowedError } from "@/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/errors/resource-not-found-error";
import type { Decimal } from "@/generated/prisma/internal/prismaNamespace";
import type { CategoryRepository } from "@/repositories/category-repository";
import type { Income, IncomeRepository } from "@/repositories/income-repository";
import { isValidAmount } from "@/utils/is-valid-amount";

interface CreateIncomeUseCaseRequest {
    title: string,
    amount: Decimal,
    categoryId: string,
    userId: string
}

interface CreateIncomeUseCaseResponse {
    income: Income
}

export class CreateIncomeUseCase {
    constructor(
        private incomeRepository: IncomeRepository,
        private categoryRepository: CategoryRepository
    ) { }

    async execute({
        title,
        amount,
        categoryId,
        userId
    }: CreateIncomeUseCaseRequest): Promise<CreateIncomeUseCaseResponse> {
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

        if (title.trim() === "") {
            throw new InvalidStringError("title");
        }

        const income = await this.incomeRepository.create({
            title,
            amount,
            categoryId,
            userId
        });

        return {
            income
        };
    }
}