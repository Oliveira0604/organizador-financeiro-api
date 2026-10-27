import { InMemoryCategoryRepository } from "@/repositories/in-memory/in-memory-category-repository";
import { InMemoryIncomeRepository } from "@/repositories/in-memory/in-memory-income-repository";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GetPercentageByCategoryIdUseCase } from "./get-percentage-by-category-id-use-case";
import type { Category } from "@/repositories/category-repository";
import { ResourceNotFoundError } from "@/errors/resource-not-found-error";
import { NotAllowedError } from "@/errors/not-allowed-error";
import { InvalidDateError } from "@/errors/invalid-date-error";

let incomeRepository: InMemoryIncomeRepository;
let categoryRepository: InMemoryCategoryRepository;
let getPercentageByCategoryIdUseCase: GetPercentageByCategoryIdUseCase;
let firstCategory: Category;
let secondCategory: Category;

describe("Get Percentage By Category Id Use Case", () => {
    beforeEach(async () => {
        vi.useFakeTimers();
        incomeRepository = new InMemoryIncomeRepository();
        categoryRepository = new InMemoryCategoryRepository();
        getPercentageByCategoryIdUseCase = new GetPercentageByCategoryIdUseCase(categoryRepository, incomeRepository);

        firstCategory = await categoryRepository.create({
            name: "month salary",
            userId: "user-01"
        });

        secondCategory = await categoryRepository.create({
            name: "freelance",
            userId: "user-01"
        });

        vi.setSystemTime(new Date(2026, 9, 1));
        await incomeRepository.create({
            title: "salary",
            amount: 100000,
            categoryId: firstCategory.id,
            userId: "user-01"
        });
        vi.setSystemTime(new Date(2026, 9, 26));
        await incomeRepository.create({
            title: "google project",
            amount: 50000,
            categoryId: secondCategory.id,
            userId: "user-01"
        });
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("should be able to get the percentage of a category", async () => {
        const { percentage } = await getPercentageByCategoryIdUseCase.execute({
            userId: "user-01",
            categoryId: firstCategory.id,
            startDate: new Date(2026, 9, 1),
            endDate: new Date(2026, 9, 26)
        });

        expect(percentage).toEqual(66.67);
    });

    it("should be able to get the percentage of the current month if the range of date is not provided", async () => {
        const { percentage } = await getPercentageByCategoryIdUseCase.execute({
            userId: "user-01",
            categoryId: firstCategory.id,
        });

        expect(percentage).toEqual(66.67);
    });

    it("should not be able to include incomes that are not in the provided range of date", async () => {
        vi.setSystemTime(new Date(2026, 9, 28));
        await incomeRepository.create({
            title: "amazon project",
            amount: 20000,
            categoryId: secondCategory.id,
            userId: "user-01"
        });

        const { percentage } = await getPercentageByCategoryIdUseCase.execute({
            userId: "user-01",
            categoryId: secondCategory.id,
            startDate: new Date(2026, 9, 1),
            endDate: new Date(2026, 9, 26)
        });

        expect(percentage).toEqual(33.33);
    });

    it("should return 0 when there is no income in the provided range of date", async () => {
        const { percentage } = await getPercentageByCategoryIdUseCase.execute({
            userId: "user-01",
            categoryId: secondCategory.id,
            startDate: new Date(2026, 9, 29),
            endDate: new Date(2026, 9, 31)
        });

        expect(percentage).toEqual(0);
    });

    it("should not be able to get the percentage if the category doesn't exist", async () => {
        await expect(
            getPercentageByCategoryIdUseCase.execute({
                userId: "user-01",
                categoryId: "non-existent",
                startDate: new Date(2026, 9, 1),
                endDate: new Date(2026, 9, 26)
            })
        ).rejects.toBeInstanceOf(ResourceNotFoundError);
    });

    it("should not be able to get the percentage if the user id is different", async () => {
        await expect(
            getPercentageByCategoryIdUseCase.execute({
                userId: "user-02",
                categoryId: secondCategory.id,
                startDate: new Date(2026, 9, 1),
                endDate: new Date(2026, 9, 26)
            })
        ).rejects.toBeInstanceOf(NotAllowedError);
    });

    it("should not be able to get the percentage if the start date is greater than end date", async () => {
        await expect(
            getPercentageByCategoryIdUseCase.execute({
                userId: "user-01",
                categoryId: firstCategory.id,
                startDate: new Date(2026, 9, 10),
                endDate: new Date(2026, 9, 1)
            })
        ).rejects.toBeInstanceOf(InvalidDateError);
    });
});