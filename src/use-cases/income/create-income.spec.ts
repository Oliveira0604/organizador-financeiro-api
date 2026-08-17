import { InMemoryCategoryRepository } from "@/repositories/in-memory/in-memory-category-repository";
import { InMemoryIncomeRepository } from "@/repositories/in-memory/in-memory-income-repository";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CreateIncomeUseCase } from "./create-income-use-case";
import { Decimal } from "@/generated/prisma/internal/prismaNamespace";
import { ResourceNotFoundError } from "@/errors/resource-not-found-error";
import { NotAllowedError } from "@/errors/not-allowed-error";
import { InvalidAmountError } from "@/errors/is-amount-valid-error";
import type { Category } from "@/repositories/category-repository";
import { InvalidStringError } from "@/errors/invalid-string-error";

let incomeRepository: InMemoryIncomeRepository;
let categoryRepository: InMemoryCategoryRepository;
let createIncomeUseCase: CreateIncomeUseCase;
let category: Category;

describe("Create Income Use Case", () => {
    beforeEach(async () => {
        incomeRepository = new InMemoryIncomeRepository();
        categoryRepository = new InMemoryCategoryRepository();
        createIncomeUseCase = new CreateIncomeUseCase(incomeRepository, categoryRepository);

        category = await categoryRepository.create({
            name: "salary",
            userId: "user-01"
        });

        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("should be able to create an income", async () => {
        vi.setSystemTime(new Date(2026, 7, 14));

        const { income } = await createIncomeUseCase.execute({
            title: "month salary",
            amount: new Decimal(20000),
            categoryId: category.id,
            userId: "user-01"
        });

        expect(income.id).toEqual(expect.any(String));
        expect(income.title).toEqual("month salary");
        expect(income.amount).toEqual(new Decimal(20000));
        expect(income.receivedAt).toEqual(new Date(2026, 7, 14));
        expect(income.categoryId).toEqual(category.id);
        expect(income.userId).toEqual("user-01");
    });

    it("should not be able to create an income if the category doesn't exist", async () => {
        await expect(
            createIncomeUseCase.execute({
                title: "month salary",
                amount: new Decimal(20000),
                categoryId: "non-existent",
                userId: "user-01"
            })
        ).rejects.toBeInstanceOf(ResourceNotFoundError);

        expect(incomeRepository.items).toHaveLength(0);
    });

    it("should not be able to create an income if the user id is different", async () => {
        await expect(
            createIncomeUseCase.execute({
                title: "month salary",
                amount: new Decimal(20000),
                categoryId: category.id,
                userId: "user-02"
            })
        ).rejects.toBeInstanceOf(NotAllowedError);

        expect(incomeRepository.items).toHaveLength(0);
    });

    it("should not be able to create an income if the amount is invalid", async () => {
        await expect(
            createIncomeUseCase.execute({
                title: "month salary",
                amount: new Decimal(0),
                categoryId: category.id,
                userId: "user-01"
            })
        ).rejects.toBeInstanceOf(InvalidAmountError);

        expect(incomeRepository.items).toHaveLength(0);
    });

    it("should not be able to create an income if the title is empty", async () => {
        await expect(
            createIncomeUseCase.execute({
                title: "",
                amount: new Decimal(20000),
                categoryId: category.id,
                userId: "user-01"
            })
        ).rejects.toBeInstanceOf(InvalidStringError);

        expect(incomeRepository.items).toHaveLength(0);
    });

    it("should not be able to create an income if the title is only white space", async () => {
        await expect(
            createIncomeUseCase.execute({
                title: " ",
                amount: new Decimal(20000),
                categoryId: category.id,
                userId: "user-01"
            })
        ).rejects.toBeInstanceOf(InvalidStringError);

        expect(incomeRepository.items).toHaveLength(0);
    });
});
