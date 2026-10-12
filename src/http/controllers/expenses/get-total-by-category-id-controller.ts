import type { GetTotalByCategoryIdUseCase } from "@/use-cases/expense/get-total-by-category-id-use-case";
import type { Controller } from "../controller";
import type { HttpRequest, HttpResponse } from "../http";
import z from "zod";

const getTotalByCategoryIdSchema = z.object({
    categoryId: z.uuid(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional()
});

export class GetTotalByCategoryIdController implements Controller {
    constructor(
        private getTotalByCategoryIdUseCase: GetTotalByCategoryIdUseCase
    ) { }

    async handle(request: HttpRequest): Promise<HttpResponse> {
        const { categoryId, startDate, endDate } = getTotalByCategoryIdSchema.parse(request.query);
        const userId = request.user!.id;

        const categoryTotal = await this.getTotalByCategoryIdUseCase.execute({
            userId,
            categoryId,
            ...(startDate !== undefined && { startDate }),
            ...(endDate !== undefined && { endDate })
        });

        return {
            statusCode: 200,
            body: categoryTotal
        };
    }
}