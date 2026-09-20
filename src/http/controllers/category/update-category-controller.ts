import type { UpdateCategoryUseCase } from "@/use-cases/category/update-category-use-case";
import type { HttpRequest, HttpResponse } from "../http";
import z from "zod";
import type { Controller } from "../controller";

const paramsSchema = z.object({
    categoryId: z.string(),
    userId: z.string()
});

const updateCategorySchema = z.object({
    name: z.string().trim().min(1)
});

export class UpdateCategoryController implements Controller {
    constructor(
        private updateCategoryUseCase: UpdateCategoryUseCase
    ) { }

    async handle(request: HttpRequest): Promise<HttpResponse> {
        const { categoryId, userId } = paramsSchema.parse(request.params);
        const { name } = updateCategorySchema.parse(request.body);

        const updatedCategory = await this.updateCategoryUseCase.execute({
            id: categoryId,
            userId,
            name
        });

        return {
            statusCode: 200,
            body: {
                updatedCategory
            }
        };
    }
}