import { DeleteCategoryController } from "@/http/controllers/category/delete-category-controller";
import { PrismaCategoryRepository } from "@/repositories/prisma/prisma-category-repository";
import { DeleteCategoryUseCase } from "@/use-cases/category/delete-category-use-case";

export function makeDeleteCategoryController() {
    const categoryRepository = new PrismaCategoryRepository();
    const deleteCategoryUseCase = new DeleteCategoryUseCase(categoryRepository);
    const controller = new DeleteCategoryController(deleteCategoryUseCase);

    return controller;
}

//TODO: I need to find why is saying "resource not found" when I use my user Id and the category