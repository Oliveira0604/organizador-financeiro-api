import type { DeleteIncomeUseCase } from "@/use-cases/income/delete-income-use-case";
import type { Controller } from "../controller";
import type { HttpRequest, HttpResponse } from "../http";
import z from "zod";

const deleteIncomeSchema = z.object({
    incomeId: z.uuid()
});

export class DeleteIncomeController implements Controller {
    constructor(
        private deleteIncomeUseCase: DeleteIncomeUseCase
    ) { }

    async handle(request: HttpRequest): Promise<HttpResponse> {
        const { incomeId } = deleteIncomeSchema.parse(request.query);
        const userId = request.user!.id;

        await this.deleteIncomeUseCase.execute({
            incomeId,
            userId
        });

        return {
            statusCode: 200
        };
    }
}