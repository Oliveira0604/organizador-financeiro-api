import { CreateCategoryController } from "@/http/controllers/category/create-category-controller";
import { PrismaCategoryRepository } from "@/repositories/prisma/prisma-category-repository";
import { CreateCategoryUseCase } from "@/use-cases/category/create-category-use-case";

export function makeCreateCategoryController() {
    const categoryRepository = new PrismaCategoryRepository();
    const createCategoryUseCase = new CreateCategoryUseCase(categoryRepository);
    const controller = new CreateCategoryController(createCategoryUseCase);

    return controller;
}