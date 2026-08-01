import { InMemoryExpenseRepository } from "@/repositories/in-memory/in-memory-expense-repository";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { FindManyByUserIdBetweenDatesUseCase } from "./find-many-by-user-id-between-dates-use-case";
import { Decimal } from "@/generated/prisma/internal/prismaNamespace";

let expenseRepository: InMemoryExpenseRepository;
let findManyByUserIdBetweenDates: FindManyByUserIdBetweenDatesUseCase;

describe("Find Many By User Id Between Dates Use Case", () => {
    beforeEach(() => {
        expenseRepository = new InMemoryExpenseRepository();
        findManyByUserIdBetweenDates = new FindManyByUserIdBetweenDatesUseCase(expenseRepository);
        vi.useFakeTimers();

        vi.setSystemTime(new Date(2026, 7, 5, 5, 35));

        expenseRepository.create({
            amount: new Decimal(100),
            categoryId: "category-01",
            paidAt: new Date(),
            title: "Supermarket",
            userId: "user-01"
        });

        vi.setSystemTime(new Date(2026, 7, 10, 2, 35));

        expenseRepository.create({
            amount: new Decimal(200),
            categoryId: "category-01",
            paidAt: new Date(),
            title: "Supermarket",
            userId: "user-01"
        });

    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("should get the user expenses between two dates", async () => {
        const { expenses } = await findManyByUserIdBetweenDates.execute({
            userId: "user-01",
            startDate: new Date("2026-08-01"),
            endDate: new Date("2026-08-30")
        });

        expect(expenses).toHaveLength(2);

        expect(expenses[0]!.paidAt).toEqual(new Date("2026-08-05T05:35:00"));
    });
});