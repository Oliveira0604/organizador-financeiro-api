import { InMemoryCategoryRepository } from "@/repositories/in-memory/in-memory-category-repository";
import { beforeEach, describe, expect, it } from "vitest";
import { CreateCategoryUseCase } from "./create-category-use-case";
import { CategoryAlreadyExistsError } from "@/errors/category-already-exists-error";

let categoryRepository: InMemoryCategoryRepository;
let createCategoryUseCase: CreateCategoryUseCase;

describe("Create Category Use Case", () => {
    beforeEach(() => {
        categoryRepository = new InMemoryCategoryRepository();
        createCategoryUseCase = new CreateCategoryUseCase(categoryRepository);
    });

    it("should be able to create a category", async () => {
        const { category } = await createCategoryUseCase.execute({
            name: "test",
            userId: "user-01"
        });

        expect(category.id).toEqual(expect.any(String));
        expect(category.name).toEqual("test");
        expect(category.userId).toEqual("user-01");

    });

    it("should be able to create a category with the same name for different users", async () => {
        await categoryRepository.create({
            name: "test",
            userId: "user-01"
        });

        const { category } = await createCategoryUseCase.execute({
            name: "test",
            userId: "user-02"
        });

        expect(category.name).toEqual("test");
        expect(category.userId).toEqual("user-02");
    });

    it("should not create a category if already exists", async () => {
        await categoryRepository.create({
            name: "test",
            userId: "user-01"
        });

        await expect(
            createCategoryUseCase.execute({
                name: "test",
                userId: "user-01"
            })
        ).rejects.toBeInstanceOf(CategoryAlreadyExistsError);
    });
});