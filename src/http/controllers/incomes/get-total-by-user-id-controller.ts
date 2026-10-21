import type { GetTotalByUserIdUseCase } from "@/use-cases/income/get-total-by-user-id-use-case";
import type { Controller } from "../controller";
import type { HttpRequest, HttpResponse } from "../http";
import z from "zod";

const getTotalByUserIdSchema = z.object({
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional()
});

export class GetTotalByUserIdController implements Controller {
    constructor(
        private getTotalByUserIdUseCase: GetTotalByUserIdUseCase
    ) { }

    async handle(request: HttpRequest): Promise<HttpResponse> {
        const { startDate, endDate } = getTotalByUserIdSchema.parse(request.query);
        const userId = request.user!.id;

        const total = await this.getTotalByUserIdUseCase.execute({
            userId,
            ...(startDate !== undefined && { startDate }),
            ...(endDate !== undefined && { endDate })
        });

        return {
            statusCode: 200,
            body: total
        };
    }
}
