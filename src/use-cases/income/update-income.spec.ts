import { InMemoryIncomeRepository } from "@/repositories/in-memory/in-memory-income-repository";
import { InMemoryUserRepository } from "@/repositories/in-memory/in-memory-user-repository";
import type { User } from "@/repositories/user-repository";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { UpdateIncomeUseCase } from "./update-income-use-case";
import type { Income } from "@/repositories/income-repository";
import type { Category } from "@/repositories/category-repository";
import { InMemoryCategoryRepository } from "@/repositories/in-memory/in-memory-category-repository";
import { Decimal } from "@/generated/prisma/internal/prismaNamespace";
import { ResourceNotFoundError } from "@/errors/resource-not-found-error";
import { NotAllowedError } from "@/errors/not-allowed-error";
import { InvalidStringError } from "@/errors/invalid-string-error";
import { InvalidAmountError } from "@/errors/is-amount-valid-error";
import { InvalidDateError } from "@/errors/invalid-date-error";

let incomeRepository: InMemoryIncomeRepository;
let userRepository: InMemoryUserRepository;
let categoryRepository: InMemoryCategoryRepository;
let updateIncomeUseCase: UpdateIncomeUseCase;
let category: Category;
let income: Income;
let user: User;

describe("Update Income Use Case", () => {
    beforeEach(async () => {
        incomeRepository = new InMemoryIncomeRepository();
        userRepository = new InMemoryUserRepository();
        categoryRepository = new InMemoryCategoryRepository();
        updateIncomeUseCase = new UpdateIncomeUseCase(incomeRepository, userRepository);
        vi.useFakeTimers();

        user = await userRepository.create({
            name: "Nathan",
            phoneNumber: "+55 11 9999-9999"
        });

        category = await categoryRepository.create({
            name: "Month salary",
            userId: user.id
        });

        vi.setSystemTime(new Date(2026, 7, 29));

        income = await incomeRepository.create({
            title: "salary",
            amount: new Decimal(100000),
            userId: user.id,
            categoryId: category.id
        });
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("should be able to update an income title", async () => {
        const { income: updatedIncome } = await updateIncomeUseCase.execute({
            incomeId: income.id,
            userId: user.id,
            title: "freelance"
        });

        expect(updatedIncome.title).toEqual("freelance");
        expect(updatedIncome.amount).toEqual(new Decimal(100000));
        expect(updatedIncome.receivedAt).toEqual(new Date(2026, 7, 29));
    });

    it("should be able to update an income amount", async () => {
        const { income: updatedIncome } = await updateIncomeUseCase.execute({
            incomeId: income.id,
            userId: user.id,
            amount: new Decimal(110000)
        });

        expect(updatedIncome.title).toEqual("salary");
        expect(updatedIncome.amount).toEqual(new Decimal(110000));
        expect(updatedIncome.receivedAt).toEqual(new Date(2026, 7, 29));
    });

    it("should be able to update an income received date", async () => {
        const { income: updatedIncome } = await updateIncomeUseCase.execute({
            incomeId: income.id,
            userId: user.id,
            receivedAt: new Date(2026, 8, 5)
        });

        expect(updatedIncome.title).toEqual("salary");
        expect(updatedIncome.amount).toEqual(new Decimal(100000));
        expect(updatedIncome.receivedAt).toEqual(new Date(2026, 8, 5));
    });

    it("should not update any income field if the income doesn't exist", async () => {
        await expect(
            updateIncomeUseCase.execute({
                incomeId: "non-existent",
                userId: user.id,
                title: "test",
                amount: new Decimal(110000),
                receivedAt: new Date(2026, 7, 31)
            })
        ).rejects.toBeInstanceOf(ResourceNotFoundError);
    });

    it("should not update any income field if the user id is different", async () => {
        const userTest = await userRepository.create({
            name: "May",
            phoneNumber: "+55 11 8888-8888"
        });

        await expect(
            updateIncomeUseCase.execute({
                incomeId: income.id,
                userId: userTest.id,
                title: "test",
                amount: new Decimal(110000),
                receivedAt: new Date(2026, 7, 31)
            })
        ).rejects.toBeInstanceOf(NotAllowedError);
    });

    it("should not update the income title if the title is empty", async () => {
        await expect(
            updateIncomeUseCase.execute({
                incomeId: income.id,
                userId: user.id,
                title: "",
            })
        ).rejects.toBeInstanceOf(InvalidStringError);
    });

    it("should not update the income title if the title is whitespace", async () => {
        await expect(
            updateIncomeUseCase.execute({
                incomeId: income.id,
                userId: user.id,
                title: " ",
            })
        ).rejects.toBeInstanceOf(InvalidStringError);
    });

    it("should not update the income amount if the amount is 0", async () => {
        await expect(
            updateIncomeUseCase.execute({
                incomeId: income.id,
                userId: user.id,
                amount: new Decimal(0),
            })
        ).rejects.toBeInstanceOf(InvalidAmountError);
    });

    it("should not update the income amount if the amount is negative", async () => {
        await expect(
            updateIncomeUseCase.execute({
                incomeId: income.id,
                userId: user.id,
                amount: new Decimal(-1000),
            })
        ).rejects.toBeInstanceOf(InvalidAmountError);
    });

    it("should not update the income if the date is invalid", async () => {
        await expect(
            updateIncomeUseCase.execute({
                incomeId: income.id,
                userId: user.id,
                receivedAt: new Date("invalid date")
            })
        ).rejects.toBeInstanceOf(InvalidDateError);
    });

});