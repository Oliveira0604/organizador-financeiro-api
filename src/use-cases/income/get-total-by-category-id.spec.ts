import { InMemoryCategoryRepository } from "@/repositories/in-memory/in-memory-category-repository";
import { InMemoryIncomeRepository } from "@/repositories/in-memory/in-memory-income-repository";
import { InMemoryUserRepository } from "@/repositories/in-memory/in-memory-user-repository";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GetTotalByCategoryIdUseCase } from "./get-total-by-category-id-use-case";
import type { Category } from "@/repositories/category-repository";
import type { User } from "@/repositories/user-repository";
import { Decimal } from "@/generated/prisma/internal/prismaNamespace";
import { ResourceNotFoundError } from "@/errors/resource-not-found-error";
import { NotAllowedError } from "@/errors/not-allowed-error";
import { InvalidDateError } from "@/errors/invalid-date-error";

let categoryRepository: InMemoryCategoryRepository;
let incomeRepository: InMemoryIncomeRepository;
let userRepository: InMemoryUserRepository;
let getTotalByCategoryIdUseCase: GetTotalByCategoryIdUseCase;
let firstCategory: Category;
let secondCategory: Category;
let user: User;


describe("Get Total By Category Id Use Case", () => {
    beforeEach(async () => {
        categoryRepository = new InMemoryCategoryRepository();
        incomeRepository = new InMemoryIncomeRepository();
        userRepository = new InMemoryUserRepository();
        getTotalByCategoryIdUseCase = new GetTotalByCategoryIdUseCase(categoryRepository, incomeRepository, userRepository);
        vi.useFakeTimers();

        user = await userRepository.create({
            name: "Nathan",
            phoneNumber: "+55 11 9999-9999"
        });

        firstCategory = await categoryRepository.create({
            name: "Month salary",
            userId: user.id
        });

        secondCategory = await categoryRepository.create({
            name: "freelance",
            userId: user.id
        });

        vi.setSystemTime(new Date(2026, 7, 5));

        await incomeRepository.create({
            title: "salary",
            amount: new Decimal(20000),
            userId: user.id,
            categoryId: firstCategory.id
        });

        vi.setSystemTime(new Date(2026, 7, 21));

        await incomeRepository.create({
            title: "salary",
            amount: new Decimal(10000),
            userId: user.id,
            categoryId: secondCategory.id
        });

    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("should be able to get the total amount of a category by id", async () => {
        const firstCategoryTotal = await getTotalByCategoryIdUseCase.execute({
            userId: user.id,
            categoryId: firstCategory.id,
            startDate: new Date(2026, 7, 1),
            endDate: new Date(2026, 7, 31)
        });

        const secondCategoryTotal = await getTotalByCategoryIdUseCase.execute({
            userId: user.id,
            categoryId: secondCategory.id,
            startDate: new Date(2026, 7, 1),
            endDate: new Date(2026, 7, 31)
        });

        expect(firstCategoryTotal.total).toEqual(new Decimal(20000));
        expect(secondCategoryTotal.total).toEqual(new Decimal(10000));
    });

    it("should return the category total amont from current month if the range of date is not provided", async () => {
        const categoryTotal = await getTotalByCategoryIdUseCase.execute({
            userId: user.id,
            categoryId: firstCategory.id,
        });

        expect(categoryTotal.total).toEqual(new Decimal(20000));
    });

    it("should not return the category total amount if start date is greater than end date", async () => {
        await expect(
            getTotalByCategoryIdUseCase.execute({
                userId: user.id,
                categoryId: firstCategory.id,
                startDate: new Date(2026, 7, 31),
                endDate: new Date(2026, 7, 1)
            })
        ).rejects.toBeInstanceOf(InvalidDateError);
    });

    it("should not get the total if the user doesn't exist", async () => {
        await expect(
            getTotalByCategoryIdUseCase.execute({
                userId: "non-existent",
                categoryId: firstCategory.id,
            })
        ).rejects.toBeInstanceOf(ResourceNotFoundError);
    });

    it("should not get the total if the category doesn't exist", async () => {
        await expect(
            getTotalByCategoryIdUseCase.execute({
                userId: user.id,
                categoryId: "non-existent"
            })
        ).rejects.toBeInstanceOf(ResourceNotFoundError);
    });

    it("should not return the amount if the user id is different", async () => {
        const userTest = await userRepository.create({
            name: "Test",
            phoneNumber: "+55 11 8888-8888"
        });

        expect(userTest.id).toEqual(expect.any(String));

        await expect(
            getTotalByCategoryIdUseCase.execute({
                userId: userTest.id,
                categoryId: firstCategory.id
            })
        ).rejects.toBeInstanceOf(NotAllowedError);
    });

    it("should return 0 if there is no income in the range of time", async () => {
        const { total } = await getTotalByCategoryIdUseCase.execute({
            userId: user.id,
            categoryId: firstCategory.id,
            startDate: new Date(2026, 7, 22),
            endDate: new Date(2026, 7, 31)
        });

        expect(total).toEqual(new Decimal(0));
    });
});