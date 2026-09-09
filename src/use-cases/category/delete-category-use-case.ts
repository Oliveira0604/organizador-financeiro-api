import { ResourceNotFoundError } from "@/errors/resource-not-found-error";
import type { CategoryRepository } from "@/repositories/category-repository";

interface DeleteCategoryUseCaseRequest {
    id: string,
    userId: string
}


export class DeleteCategoryUseCase {
    constructor(private categoryRepository: CategoryRepository) { }

    async execute({
        id,
        userId
    }: DeleteCategoryUseCaseRequest): Promise<void> {
        const category = await this.categoryRepository.findById(id);

        if (!category || category.userId !== userId) {
            throw new ResourceNotFoundError();
        }

        await this.categoryRepository.delete(category.id);
    }
}