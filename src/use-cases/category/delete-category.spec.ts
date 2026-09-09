import { InMemoryCategoryRepository } from "@/repositories/in-memory/in-memory-category-repository";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DeleteCategoryUseCase } from "./delete-category-use-case";
import { ResourceNotFoundError } from "@/errors/resource-not-found-error";

let categoryRepository: InMemoryCategoryRepository;
let deleteCategoryUseCase: DeleteCategoryUseCase;

describe("Delete Category Use Case", () => {
    beforeEach(() => {
        categoryRepository = new InMemoryCategoryRepository();
        deleteCategoryUseCase = new DeleteCategoryUseCase(categoryRepository);
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("should be able to soft delete a category", async () => {
        const category = await categoryRepository.create({
            name: "test",
            userId: "user-01"
        });

        vi.setSystemTime(new Date(2026, 8, 9));

        await deleteCategoryUseCase.execute({
            id: category.id,
            userId: "user-01"
        });

        expect(category.deletedAt).toEqual(new Date(2026, 8, 9));
    });

    it("should not be able to soft delete a category if it doesn't exist", async () => {
        await expect(
            deleteCategoryUseCase.execute({
                id: "non-existent",
                userId: "user-01"
            })
        ).rejects.toBeInstanceOf(ResourceNotFoundError);
    });

    it("should not be able to soft delete a category if user id is different", async () => {
        const category = await categoryRepository.create({
            name: "test",
            userId: "user-01"
        });

        await expect(
            deleteCategoryUseCase.execute({
                id: category.id,
                userId: "user-02"
            })
        ).rejects.toBeInstanceOf(ResourceNotFoundError);
    });
});