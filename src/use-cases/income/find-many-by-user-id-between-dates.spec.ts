import { InMemoryIncomeRepository } from "@/repositories/in-memory/in-memory-income-repository";
import { InMemoryUserRepository } from "@/repositories/in-memory/in-memory-user-repository";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { FindManyByUserIdBetweenDatesUseCase } from "./find-many-by-user-id-between-dates-use-case";
import type { User } from "@/repositories/user-repository";
import { Decimal } from "@/generated/prisma/internal/prismaNamespace";
import { ResourceNotFoundError } from "@/errors/resource-not-found-error";
import { InvalidDateError } from "@/errors/invalid-date-error";

let incomeRepository: InMemoryIncomeRepository;
let userRepository: InMemoryUserRepository;
let findManyByUserIdBetweenDatesUseCase: FindManyByUserIdBetweenDatesUseCase;
let startDate: Date;
let endDate: Date;
let user: User;

describe("Find Many By User Id Between Dates Use Case", () => {
    beforeEach(async () => {
        incomeRepository = new InMemoryIncomeRepository();
        userRepository = new InMemoryUserRepository();
        findManyByUserIdBetweenDatesUseCase = new FindManyByUserIdBetweenDatesUseCase(incomeRepository, userRepository);
        startDate = new Date(2026, 7, 1);
        endDate = new Date(2026, 7, 31);
        vi.useFakeTimers();

        user = await userRepository.create({
            name: "Nathan",
            phoneNumber: "+55 11 9999-9999"
        });

        vi.setSystemTime(new Date(2026, 7, 5));

        await incomeRepository.create({
            title: "Month salary",
            amount: new Decimal(20000),
            categoryId: "category-01",
            userId: user.id
        });

        vi.setSystemTime(new Date(2026, 7, 19));

        await incomeRepository.create({
            title: "Freelance",
            amount: new Decimal(10000),
            categoryId: "category-02",
            userId: user.id
        });

        vi.setSystemTime(new Date(2026, 7, 28));

        await incomeRepository.create({
            title: "Investiments",
            amount: new Decimal(25000),
            categoryId: "category-03",
            userId: user.id
        });
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("should be able to find the user incomes between two dates", async () => {
        const { incomes } = await findManyByUserIdBetweenDatesUseCase.execute({
            userId: user.id,
            startDate,
            endDate
        });

        expect(incomes).toHaveLength(3);
        expect(incomes[0]?.id).toEqual(expect.any(String));
        expect(incomes[0]?.title).toEqual("Month salary");
        expect(incomes[0]?.amount).toEqual(new Decimal(20000));
        expect(incomes[0]?.categoryId).toEqual("category-01");
        expect(incomes[0]?.userId).toEqual(user.id);

        expect(incomes[1]?.title).toEqual("Freelance");
        expect(incomes[1]?.amount).toEqual(new Decimal(10000));
        expect(incomes[1]?.categoryId).toEqual("category-02");
        expect(incomes[1]?.userId).toEqual(user.id);

        expect(incomes[2]?.title).toEqual("Investiments");
        expect(incomes[2]?.amount).toEqual(new Decimal(25000));
        expect(incomes[2]?.categoryId).toEqual("category-03");
        expect(incomes[2]?.userId).toEqual(user.id);
    });

    it("should return the incomes in the current month if the range of dates are not provided", async () => {
        const { incomes } = await findManyByUserIdBetweenDatesUseCase.execute({
            userId: user.id,
        });

        expect(incomes).toHaveLength(3);
        expect(incomes[0]?.id).toEqual(expect.any(String));
        expect(incomes[0]?.title).toEqual("Month salary");
        expect(incomes[0]?.amount).toEqual(new Decimal(20000));
        expect(incomes[0]?.categoryId).toEqual("category-01");
        expect(incomes[0]?.userId).toEqual(user.id);

        expect(incomes[1]?.title).toEqual("Freelance");
        expect(incomes[1]?.amount).toEqual(new Decimal(10000));
        expect(incomes[1]?.categoryId).toEqual("category-02");
        expect(incomes[1]?.userId).toEqual(user.id);

        expect(incomes[2]?.title).toEqual("Investiments");
        expect(incomes[2]?.amount).toEqual(new Decimal(25000));
        expect(incomes[2]?.categoryId).toEqual("category-03");
        expect(incomes[2]?.userId).toEqual(user.id);
    });

    it("should not get the category incomes if start date is greater than end date", async () => {
        await expect(
            findManyByUserIdBetweenDatesUseCase.execute({
                userId: user.id,
                startDate: new Date(2026, 7, 31),
                endDate: new Date(2026, 7, 1)
            })
        ).rejects.toBeInstanceOf(InvalidDateError);
    });

    it("should not be able get the incomes if the user doesn't exists", async () => {
        await expect(
            findManyByUserIdBetweenDatesUseCase.execute({
                userId: "non-existent",
                startDate,
                endDate
            })
        ).rejects.toBeInstanceOf(ResourceNotFoundError);
    });

    it("should not get the incomes from another person", async () => {
        vi.setSystemTime(new Date(2026, 7, 5));

        const secondUser = await userRepository.create({
            name: "John",
            phoneNumber: "+55 11 8888-8888"
        });

        await incomeRepository.create({
            title: "Month salary",
            amount: new Decimal(10000),
            categoryId: "category-01",
            userId: secondUser.id
        });

        const { incomes } = await findManyByUserIdBetweenDatesUseCase.execute({
            userId: secondUser.id,
            startDate,
            endDate
        });

        expect(incomes).toHaveLength(1);
        expect(incomes[0]?.id).toEqual(expect.any(String));
        expect(incomes[0]?.title).toEqual("Month salary");
        expect(incomes[0]?.amount).toEqual(new Decimal(10000));
        expect(incomes[0]?.categoryId).toEqual("category-01");
        expect(incomes[0]?.userId).toEqual(secondUser.id);
    });

    it("should return an empty array if there is no income", async () => {
        const { incomes } = await findManyByUserIdBetweenDatesUseCase.execute({
            userId: user.id,
            startDate: new Date(2026, 6, 1),
            endDate: new Date(2026, 6, 31)
        });

        expect(incomes).toHaveLength(0);
    });

    it("should not return an income that is not in the given range", async () => {
        vi.setSystemTime(new Date(2026, 8, 5));

        const testIncome = await incomeRepository.create({
            title: "test",
            amount: new Decimal(30000),
            categoryId: "category-01",
            userId: user.id
        });

        const { incomes } = await findManyByUserIdBetweenDatesUseCase.execute({
            userId: user.id,
            startDate,
            endDate
        });

        expect(incomes).toHaveLength(3);
        expect(incomes.find((income) => income.id === testIncome.id)).toBeUndefined();
    });
});