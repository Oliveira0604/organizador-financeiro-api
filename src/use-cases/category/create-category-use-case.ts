import type { Category, CategoryRepository } from "@/repositories/category-repository";
import { CategoryAlreadyExistsError } from "@/errors/category-already-exists-error";

interface CreateCategoryUseCaseRequest {
    name: string,
    userId: string
}

interface CreateCategoryUseCaseResponse {
    category: Category
}

export class CreateCategoryUseCase {
    constructor(private categoryRepository: CategoryRepository) { }

    async execute({
        name,
        userId
    }: CreateCategoryUseCaseRequest): Promise<CreateCategoryUseCaseResponse> {

        const existingCategory = await this.categoryRepository.findByName(userId, name);

        if (existingCategory) {
            throw new CategoryAlreadyExistsError();
        }

        const category = await this.categoryRepository.create({
            name,
            userId
        });

        return {
            category
        };
    }
}