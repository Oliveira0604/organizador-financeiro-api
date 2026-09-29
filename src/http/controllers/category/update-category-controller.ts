import type { UpdateCategoryUseCase } from "@/use-cases/category/update-category-use-case";
import type { HttpRequest, HttpResponse } from "../http";
import z from "zod";
import type { Controller } from "../controller";

const paramsSchema = z.object({
    id: z.string(),
});

const updateCategorySchema = z.object({
    name: z.string().trim().min(1)
});


export class UpdateCategoryController implements Controller {
    constructor(
        private updateCategoryUseCase: UpdateCategoryUseCase
    ) { }

    async handle(request: HttpRequest): Promise<HttpResponse> {
        const { id } = paramsSchema.parse(request.params);
        const { name } = updateCategorySchema.parse(request.body);
        const userId = request.user!.id;

        const { category } = await this.updateCategoryUseCase.execute({
            id,
            userId,
            name
        });

        return {
            statusCode: 200,
            body: {
                id: category!.id,
                name: category!.name
            }
        };
    }
}