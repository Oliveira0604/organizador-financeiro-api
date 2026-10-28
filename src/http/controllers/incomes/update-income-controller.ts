import type { UpdateIncomeUseCase } from "@/use-cases/income/update-income-use-case";
import type { Controller } from "../controller";
import type { HttpRequest, HttpResponse } from "../http";
import z from "zod";

const updateIncomeSchemaQuery = z.object({
    incomeId: z.uuid(),

});

const updateIncomeSchemaBody = z.object({
    title: z.string().optional(),
    amount: z.coerce.number().optional(),
    receivedAt: z.coerce.date().optional()
});

export class UpdateIncomeController implements Controller {
    constructor(
        private updateIncomeUseCase: UpdateIncomeUseCase
    ) { }

    async handle(request: HttpRequest): Promise<HttpResponse> {
        const { incomeId } = updateIncomeSchemaQuery.parse(request.query);
        const { title, amount, receivedAt } = updateIncomeSchemaBody.parse(request.body);
        const userId = request.user!.id;

        const { income } = await this.updateIncomeUseCase.execute({
            userId,
            incomeId,
            ...(title !== undefined && { title }),
            ...(amount !== undefined && { amount }),
            ...(receivedAt !== undefined && { receivedAt })
        });

        return {
            statusCode: 200,
            body: {
                title: income!.title,
                amount: income!.amount,
                receivedAt: income!.receivedAt
            }
        };
    }
}