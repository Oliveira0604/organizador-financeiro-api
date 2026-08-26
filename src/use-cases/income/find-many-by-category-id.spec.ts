import { InMemoryIncomeRepository } from "@/repositories/in-memory/in-memory-income-repository";
import { InMemoryUserRepository } from "@/repositories/in-memory/in-memory-user-repository";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { FindManyByCategoryIdUseCase } from "./find-many-by-category-id-use-case";
import { InMemoryCategoryRepository } from "@/repositories/in-memory/in-memory-category-repository";
import type { Category } from "@/repositories/category-repository";
import type { User } from "@/repositories/user-repository";
import { Decimal } from "@/generated/prisma/internal/prismaNamespace";
import { ResourceNotFoundError } from "@/errors/resource-not-found-error";
import { NotAllowedError } from "@/errors/not-allowed-error";

let incomeRepository: InMemoryIncomeRepository;
let userRepository: InMemoryUserRepository;
let categoryRepository: InMemoryCategoryRepository;
let findManyByCategoryIdUseCase: FindManyByCategoryIdUseCase;
let firstCategory: Category;
let secondCategory: Category;
let user: User;

describe("Find Many By Category Id Use Case", () => {
    beforeEach(async () => {
        incomeRepository = new InMemoryIncomeRepository();
        userRepository = new InMemoryUserRepository();
        categoryRepository = new InMemoryCategoryRepository();
        findManyByCategoryIdUseCase = new FindManyByCategoryIdUseCase(incomeRepository, userRepository, categoryRepository);
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
            amount: new Decimal(30000),
            categoryId: firstCategory.id,
            userId: user.id
        });

        vi.setSystemTime(new Date(2026, 7, 10));

        await incomeRepository.create({
            title: "google project",
            amount: new Decimal(15000),
            categoryId: secondCategory.id,
            userId: user.id
        });

        vi.setSystemTime(new Date(2026, 7, 20));

        await incomeRepository.create({
            title: "amazon project",
            amount: new Decimal(10000),
            categoryId: secondCategory.id,
            userId: user.id
        });

    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("should get the category incomes", async () => {
        const { incomes } = await findManyByCategoryIdUseCase.execute({
            userId: user.id,
            categoryId: firstCategory.id,
            startDate: new Date(2026, 7, 1),
            endDate: new Date(2026, 7, 31)
        });

        const { incomes: secondIncomes } = await findManyByCategoryIdUseCase.execute({
            userId: user.id,
            categoryId: secondCategory.id,
            startDate: new Date(2026, 7, 1),
            endDate: new Date(2026, 7, 31)
        });

        expect(incomes).toHaveLength(1);
        expect(incomes[0]?.title).toEqual("salary");
        expect(incomes[0]?.amount).toEqual(new Decimal(30000));
        expect(incomes[0]?.receivedAt).toEqual(new Date(2026, 7, 5));

        expect(secondIncomes).toHaveLength(2);
        expect(secondIncomes[0]?.title).toEqual("google project");
        expect(secondIncomes[0]?.amount).toEqual(new Decimal(15000));
        expect(secondIncomes[0]?.receivedAt).toEqual(new Date(2026, 7, 10));
        expect(secondIncomes[1]?.title).toEqual("amazon project");
        expect(secondIncomes[1]?.amount).toEqual(new Decimal(10000));
        expect(secondIncomes[1]?.receivedAt).toEqual(new Date(2026, 7, 20));

    });

    it("should not get the category incomes if the user doesn't exist", async () => {
        await expect(
            findManyByCategoryIdUseCase.execute({
                userId: "non-existent",
                categoryId: firstCategory.id,
                startDate: new Date(2026, 7, 1),
                endDate: new Date(2026, 7, 31)
            })
        ).rejects.toBeInstanceOf(ResourceNotFoundError);
    });

    it("should not get the category incomes if the category doesn't exist", async () => {
        await expect(
            findManyByCategoryIdUseCase.execute({
                userId: user.id,
                categoryId: "non-existent",
                startDate: new Date(2026, 7, 1),
                endDate: new Date(2026, 7, 31)
            })
        ).rejects.toBeInstanceOf(ResourceNotFoundError);
    });

    it("should not get the category incomes if the user id is different", async () => {
        const secondUser = await userRepository.create({
            name: "test",
            phoneNumber: "+55 11 8888-8888"
        });

        await expect(
            findManyByCategoryIdUseCase.execute({
                userId: secondUser.id,
                categoryId: firstCategory.id,
                startDate: new Date(2026, 7, 1),
                endDate: new Date(2026, 7, 31)
            })
        ).rejects.toBeInstanceOf(NotAllowedError);
    });

    it("should not get the income if it is not in the range of time provided", async () => {
        vi.setSystemTime(new Date(2026, 8, 12));

        const outOfRangeIncome = await incomeRepository.create({
            title: "freelance",
            amount: new Decimal(20000),
            userId: user.id,
            categoryId: secondCategory.id
        });

        const { incomes } = await findManyByCategoryIdUseCase.execute({
            userId: user.id,
            categoryId: secondCategory.id,
            startDate: new Date(2026, 7, 1),
            endDate: new Date(2026, 7, 31)
        });

        expect(incomes).toHaveLength(2);
        expect(incomes.find((income) => income.id === outOfRangeIncome.id)).toBeUndefined();
    });

    it("should not get the incomes from another person", async () => {
        const secondUser = await userRepository.create({
            name: "May",
            phoneNumber: "+55 11 8888-8888"
        });

        vi.setSystemTime(new Date(2026, 7, 5));

        await incomeRepository.create({
            title: "freelance",
            amount: new Decimal(10000),
            userId: secondUser.id,
            categoryId: secondCategory.id
        });

        const { incomes } = await findManyByCategoryIdUseCase.execute({
            userId: user.id,
            categoryId: secondCategory.id,
            startDate: new Date(2026, 7, 1),
            endDate: new Date(2026, 7, 31)
        });

        expect(incomes).toHaveLength(2);
        expect(incomes[0]?.userId).toEqual(user.id);
        expect(incomes[1]?.userId).toEqual(user.id);
    });
});

// TODO: Finish this test and commit (I've already commited the use case but didn't do the git push)