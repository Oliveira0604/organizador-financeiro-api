import { InMemoryCategoryRepository } from "@/repositories/in-memory/in-memory-category-repository";
import { InMemoryExpenseRepository } from "@/repositories/in-memory/in-memory-expense-repository";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GetTotalByUserIdUseCase } from "./get-total-by-user-id-use-case";
import { InMemoryUserRepository } from "@/repositories/in-memory/in-memory-user-repository";
import type { User } from "@/repositories/user-repository";
import { ResourceNotFoundError } from "@/errors/resource-not-found-error";
import { InvalidDateError } from "@/errors/invalid-date-error";
import { NotAllowedError } from "@/errors/not-allowed-error";

let expenseRepository: InMemoryExpenseRepository;
let userRepository: InMemoryUserRepository;
let categoryRepository: InMemoryCategoryRepository;
let getTotalByUserIdUseCase: GetTotalByUserIdUseCase;
let user: User;

describe("Get Total By User Id Use Case", () => {
    beforeEach(async () => {
        expenseRepository = new InMemoryExpenseRepository();
        userRepository = new InMemoryUserRepository();
        categoryRepository = new InMemoryCategoryRepository();
        getTotalByUserIdUseCase = new GetTotalByUserIdUseCase(expenseRepository, userRepository);
        vi.useFakeTimers();

        user = await userRepository.create({
            name: "Nathan",
            email: "nathan@email.com",
            passwordHash: "12345678"
        });

        const firstCategory = await categoryRepository.create({
            name: "supermarket",
            userId: "user-01"
        });

        const secondCategory = await categoryRepository.create({
            name: "house bills",
            userId: "user-01"
        });

        vi.setSystemTime(new Date(2026, 9, 1));

        await expenseRepository.create({
            title: "month shopping",
            userId: user.id,
            amount: 1000,
            categoryId: firstCategory.id,

        });

        vi.setSystemTime(new Date(2026, 9, 20));

        await expenseRepository.create({
            title: "electricity bill",
            userId: user.id,
            amount: 200,
            categoryId: secondCategory.id,

        });

        vi.setSystemTime(new Date(2026, 9, 25));

        await expenseRepository.create({
            title: "meat",
            userId: user.id,
            amount: 200,
            categoryId: firstCategory.id,

        });

    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("should be able to get the user total of expense between dates", async () => {
        const { total } = await getTotalByUserIdUseCase.execute({
            userId: user.id,
            requesterId: user.id,
            startDate: new Date(2026, 9, 1),
            endDate: new Date(2026, 9, 31)
        });

        expect(total).toEqual(1400);
    });

    it("should be able to get the expenses from the current month if the range of data is not provided", async () => {
        const { total } = await getTotalByUserIdUseCase.execute({
            userId: user.id,
            requesterId: user.id
        });

        expect(total).toEqual(1400);
    });

    it("should not get the total amount if the user doesn't exist", async () => {
        await expect(
            getTotalByUserIdUseCase.execute({
                userId: "non-existent",
                requesterId: "non-existent",
                startDate: new Date(2026, 9, 1),
                endDate: new Date(2026, 9, 31)
            })
        ).rejects.toBeInstanceOf(ResourceNotFoundError);
    });

    it("should not be able to get the total amount if the start date is greater than end date", async () => {
        await expect(
            getTotalByUserIdUseCase.execute({
                userId: user.id,
                requesterId: user.id,
                startDate: new Date(2026, 9, 20),
                endDate: new Date(2026, 9, 5)
            })
        ).rejects.toBeInstanceOf(InvalidDateError);
    });

    it("should not be able to get total expenses when requester is not the owner", async () => {
        const secondUser = await userRepository.create({
            name: "May",
            email: "may@email.com",
            passwordHash: "12345678"
        });

        await expect(
            getTotalByUserIdUseCase.execute({
                userId: user.id,
                requesterId: secondUser.id,
                startDate: new Date(2026, 9, 1),
                endDate: new Date(2026, 9, 31)
            })
        ).rejects.toBeInstanceOf(NotAllowedError);

    });

    it("should calculate totals independently for different users", async () => {
        const secondUser = await userRepository.create({
            name: "May",
            email: "may@email.com",
            passwordHash: "12345678"
        });

        const firstCategory = await categoryRepository.create({
            name: "supermarket",
            userId: secondUser.id
        });

        const secondCategory = await categoryRepository.create({
            name: "house bills",
            userId: secondUser.id
        });

        vi.setSystemTime(new Date(2026, 9, 1));
        await expenseRepository.create({
            title: "month shopping",
            userId: secondUser.id,
            amount: 1000,
            categoryId: firstCategory.id,
        });

        vi.setSystemTime(new Date(2026, 9, 31));
        await expenseRepository.create({
            title: "electricity bill",
            userId: secondUser.id,
            amount: 100,
            categoryId: secondCategory.id,
        });

        const { total: firstUserTotal } = await getTotalByUserIdUseCase.execute({
            userId: user.id,
            requesterId: user.id,
            startDate: new Date(2026, 9, 1),
            endDate: new Date(2026, 9, 31)
        });

        const { total: secondUserTotal } = await getTotalByUserIdUseCase.execute({
            userId: secondUser.id,
            requesterId: secondUser.id,
            startDate: new Date(2026, 9, 1),
            endDate: new Date(2026, 9, 31)
        });

        expect(firstUserTotal).toEqual(1400);
        expect(secondUserTotal).toEqual(1100);
    });

    it("should not include expenses that are not in the providaded range of date", async () => {
        const { total } = await getTotalByUserIdUseCase.execute({
            userId: user.id,
            requesterId: user.id,
            startDate: new Date(2026, 9, 1),
            endDate: new Date(2026, 9, 20)
        });

        expect(total).toEqual(1200);
    });
});