import { InMemoryCategoryRepository } from "@/repositories/in-memory/in-memory-category-repository";
import { beforeEach, describe, expect, it } from "vitest";
import { UpdateCategoryUseCase } from "./update-category-use-case";
import { ResourceNotFoundError } from "@/errors/resource-not-found-error";
import type { Category } from "@/repositories/category-repository";

let categoryRepository: InMemoryCategoryRepository;
let updateCategoryUseCase: UpdateCategoryUseCase;

let category: Category;

describe("Update Category Use Case", () => {
    beforeEach(async () => {
        categoryRepository = new InMemoryCategoryRepository();
        updateCategoryUseCase = new UpdateCategoryUseCase(categoryRepository);

        category = await categoryRepository.create({
            name: "test",
            userId: "user-01"
        });
    });

    it("should be able to update category name", async () => {

        const updatedCategory = await updateCategoryUseCase.execute({
            id: category.id,
            name: "updated name",
            userId: "user-01"
        });

        expect(updatedCategory.category?.name).toEqual("updated name");
        expect(updatedCategory.category?.userId).toEqual("user-01");
    });


    it("should not be able to update a category if it doesn't exist", async () => {
        await expect(
            updateCategoryUseCase.execute({
                id: "non-existent",
                userId: "user-01",
                name: "test"
            })
        ).rejects.toBeInstanceOf(ResourceNotFoundError);
    });

    it("should not update the category name if the user id is different", async () => {

        await expect(
            updateCategoryUseCase.execute({
                id: category.id,
                userId: "user-02",
                name: "updated name"
            })
        ).rejects.toBeInstanceOf(ResourceNotFoundError);
    });
});