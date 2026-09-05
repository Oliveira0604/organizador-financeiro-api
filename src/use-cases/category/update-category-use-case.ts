import { InvalidStringError } from "@/errors/invalid-string-error";
import { ResourceNotFoundError } from "@/errors/resource-not-found-error";
import type { Category, CategoryRepository, UpdateCategoryData } from "@/repositories/category-repository";

interface UpdateCategoryUseCaseRequest {
    id: string
    userId: string
    name?: string
}

interface UpdateCategoryUseCaseResponse {
    category: Category | null
}

export class UpdateCategoryUseCase {
    constructor(private categoryRepository: CategoryRepository) { }

    async execute({
        id,
        userId,
        name
    }: UpdateCategoryUseCaseRequest): Promise<UpdateCategoryUseCaseResponse> {
        const category = await this.categoryRepository.findById(id);

        if (!category || category.userId !== userId) {
            throw new ResourceNotFoundError();
        }

        const data: UpdateCategoryData = {};

        if (name !== undefined) {
            if (name.trim() === "") {
                throw new InvalidStringError();
            }
            data.name = name;
        }

        const updatedCategory = await this.categoryRepository.update(
            category.id,
            data
        );

        return {
            category: updatedCategory
        };
    }
}