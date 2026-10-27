import type { GetPercentageByCategoryIdUseCase } from "@/use-cases/income/get-percentage-by-category-id-use-case";
import type { Controller } from "../controller";
import type { HttpRequest, HttpResponse } from "../http";
import z from "zod";

const getPercentageByCategorySchema = z.object({
    categoryId: z.uuid(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional()
});

export class GetPercentageByCategoryIdController implements Controller {
    constructor(
        private getPercentageByCategoryIdUseCase: GetPercentageByCategoryIdUseCase
    ) { }

    async handle(request: HttpRequest): Promise<HttpResponse> {
        const { categoryId, startDate, endDate } = getPercentageByCategorySchema.parse(request.query);
        const userId = request.user!.id;

        const percentage = await this.getPercentageByCategoryIdUseCase.execute({
            userId,
            categoryId,
            ...(startDate !== undefined && { startDate }),
            ...(endDate !== undefined && { endDate })
        });

        return {
            statusCode: 200,
            body: percentage
        };
    }
}