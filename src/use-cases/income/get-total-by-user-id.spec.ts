import { InMemoryIncomeRepository } from "@/repositories/in-memory/in-memory-income-repository";
import { InMemoryUserRepository } from "@/repositories/in-memory/in-memory-user-repository";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GetTotalByUserIdUseCase } from "./get-total-by-user-id-use-case";
import type { Category } from "@/repositories/category-repository";
import type { User } from "@/repositories/user-repository";
import { InMemoryCategoryRepository } from "@/repositories/in-memory/in-memory-category-repository";
import { Decimal } from "@/generated/prisma/internal/prismaNamespace";
import { ResourceNotFoundError } from "@/errors/resource-not-found-error";

let incomeRepository: InMemoryIncomeRepository;
let userRepository: InMemoryUserRepository;
let categoryRepository: InMemoryCategoryRepository;
let getTotalByUserIdUseCase: GetTotalByUserIdUseCase;
let firstCategory: Category;
let secondCategory: Category;
let user: User;

describe("Get Total By User Id Use Case", () => {
    beforeEach(async () => {
        incomeRepository = new InMemoryIncomeRepository();
        userRepository = new InMemoryUserRepository();
        categoryRepository = new InMemoryCategoryRepository();
        getTotalByUserIdUseCase = new GetTotalByUserIdUseCase(incomeRepository, userRepository);
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
            name: "Freelance",
            userId: user.id
        });

        vi.setSystemTime(new Date(2026, 7, 5));

        await incomeRepository.create({
            title: "Salary",
            amount: new Decimal(40000),
            categoryId: firstCategory.id,
            userId: user.id
        });

        vi.setSystemTime(new Date(2026, 7, 10));

        await incomeRepository.create({
            title: "Google project",
            amount: new Decimal(25000),
            categoryId: secondCategory.id,
            userId: user.id
        });

        vi.setSystemTime(new Date(2026, 7, 20));

        await incomeRepository.create({
            title: "Amazon project",
            amount: new Decimal(15000),
            categoryId: secondCategory.id,
            userId: user.id
        });
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("should get the user total amount in the range of time provided", async () => {
        const { total } = await getTotalByUserIdUseCase.execute({
            userId: user.id,
            startDate: new Date(2026, 7, 1),
            endDate: new Date(2026, 7, 31)
        });

        expect(total).toEqual(new Decimal(80000));
    });

    it("should not get the total amount if the user doesn't exist", async () => {
        await expect(
            getTotalByUserIdUseCase.execute({
                userId: "non-existent",
                startDate: new Date(2026, 7, 1),
                endDate: new Date(2026, 7, 31)
            })
        ).rejects.toBeInstanceOf(ResourceNotFoundError);
    });

    it("should calculate totals independently for different users", async () => {
        const secondUser = await userRepository.create({
            name: "May",
            phoneNumber: "+55 11 8888-8888",
        });

        vi.setSystemTime(new Date(2026, 7, 5));

        await incomeRepository.create({
            title: "salary",
            amount: new Decimal(40000),
            userId: secondUser.id,
            categoryId: firstCategory.id
        });

        vi.setSystemTime(new Date(2026, 7, 10));

        await incomeRepository.create({
            title: "Makan project",
            amount: new Decimal(15000),
            userId: secondUser.id,
            categoryId: secondCategory.id
        });

        vi.setSystemTime(new Date(2026, 7, 20));

        await incomeRepository.create({
            title: "Big agency project",
            amount: new Decimal(20000),
            userId: secondUser.id,
            categoryId: secondCategory.id
        });

        const { total } = await getTotalByUserIdUseCase.execute({
            userId: secondUser.id,
            startDate: new Date(2026, 7, 1),
            endDate: new Date(2026, 7, 31)
        });

        const { total: firstUserTotal } = await getTotalByUserIdUseCase.execute({
            userId: user.id,
            startDate: new Date(2026, 7, 1),
            endDate: new Date(2026, 7, 31)
        });

        expect(total).toEqual(new Decimal(75000));
        expect(firstUserTotal).toEqual(new Decimal(80000));
    });

    it("should return 0 if there is no income in the provided range of time", async () => {
        const { total } = await getTotalByUserIdUseCase.execute({
            userId: user.id,
            startDate: new Date(2026, 8, 1),
            endDate: new Date(2026, 8, 31)
        });

        expect(total).toEqual(new Decimal(0));
    });

    it("should not include incomes thay is not in the provided range of time", async () => {
        vi.setSystemTime(new Date(2026, 8, 5));

        await incomeRepository.create({
            title: "Month salary",
            amount: new Decimal(50000),
            userId: user.id,
            categoryId: firstCategory.id
        });

        const { total } = await getTotalByUserIdUseCase.execute({
            userId: user.id,
            startDate: new Date(2026, 7, 1),
            endDate: new Date(2026, 7, 31)
        });

        expect(total).toEqual(new Decimal(80000));
    });
});
