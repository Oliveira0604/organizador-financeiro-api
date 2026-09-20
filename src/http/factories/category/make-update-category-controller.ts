import { UpdateCategoryController } from "@/http/controllers/category/update-category-controller";
import { PrismaCategoryRepository } from "@/repositories/prisma/prisma-category-repository";
import { UpdateCategoryUseCase } from "@/use-cases/category/update-category-use-case";

export function makeUpdateCategoryController() {
    const categoryRepository = new PrismaCategoryRepository();
    const updateCategoryUseCase = new UpdateCategoryUseCase(categoryRepository);
    const controller = new UpdateCategoryController(updateCategoryUseCase);

    return controller;
}