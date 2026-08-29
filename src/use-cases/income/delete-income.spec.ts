import { InMemoryIncomeRepository } from "@/repositories/in-memory/in-memory-income-repository";
import type { Income } from "@/repositories/income-repository";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DeleteIncomeUseCase } from "./delete-income-use-case";
import { Decimal } from "@/generated/prisma/internal/prismaNamespace";
import { ResourceNotFoundError } from "@/errors/resource-not-found-error";
import { NotAllowedError } from "@/errors/not-allowed-error";

let incomeRepository: InMemoryIncomeRepository;
let deleteIncomeUseCase: DeleteIncomeUseCase;
let income: Income;

describe("Delete Income Use Case", () => {
    beforeEach(async () => {
        incomeRepository = new InMemoryIncomeRepository();
        deleteIncomeUseCase = new DeleteIncomeUseCase(incomeRepository);
        vi.useFakeTimers();

        income = await incomeRepository.create({
            title: "salary",
            amount: new Decimal(110000),
            userId: "user-01",
            categoryId: "category-01"
        });
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("should be able to soft delete an income", async () => {
        vi.setSystemTime(new Date(2026, 7, 29));

        await deleteIncomeUseCase.execute({
            incomeId: income.id,
            userId: "user-01"
        });

        const deletedIncome = await incomeRepository.findById(income.id);

        expect(deletedIncome?.deletedAt).toEqual(new Date(2026, 7, 29));
    });

    it("should not delete an income if the income doesn't exist", async () => {
        await expect(
            deleteIncomeUseCase.execute({
                incomeId: "non-existent",
                userId: "user-01"
            })
        ).rejects.toBeInstanceOf(ResourceNotFoundError);
    });

    it("should not delete an income if the user id is different", async () => {
        await expect(
            deleteIncomeUseCase.execute({
                incomeId: income.id,
                userId: "different-id"
            })
        ).rejects.toBeInstanceOf(NotAllowedError);
    });
});