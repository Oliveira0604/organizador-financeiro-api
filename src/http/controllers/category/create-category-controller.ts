import type { HttpResponse } from "../http";
import type { Controller } from "../controller";
import type { HttpRequest } from "../http";
import z from "zod";
import type { CreateCategoryUseCase } from "@/use-cases/category/create-category-use-case";

const paramsSchema = z.object({
    id: z.string()
});

const createCategoryBodySchema = z.object({
    name: z.string().trim().min(1)
});

export class CreateCategoryController implements Controller {
    constructor(
        private createCategoryUseCase: CreateCategoryUseCase
    ) { }

    async handle(request: HttpRequest): Promise<HttpResponse> {

        const { id } = paramsSchema.parse(request.params);

        const { name } = createCategoryBodySchema.parse(request.body);

        const category = await this.createCategoryUseCase.execute({
            userId: id,
            name
        });

        return {
            statusCode: 201,
            body: {
                category
            }
        };
    }
}