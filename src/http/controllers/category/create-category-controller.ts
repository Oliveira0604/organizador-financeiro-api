import type { HttpResponse } from "../http";
import type { Controller } from "../controller";
import type { HttpRequest } from "../http";
import z from "zod";
import type { CreateCategoryUseCase } from "@/use-cases/category/create-category-use-case";

const createCategoryBodySchema = z.object({
    name: z.string().trim().min(1)
});

export class CreateCategoryController implements Controller {
    constructor(
        private createCategoryUseCase: CreateCategoryUseCase
    ) { }

    async handle(request: HttpRequest): Promise<HttpResponse> {

        const userId = request.user!.id;

        const { name } = createCategoryBodySchema.parse(request.body);

        const { category } = await this.createCategoryUseCase.execute({
            userId,
            name
        });

        return {
            statusCode: 201,
            body: {
                id: category.id,
                name: category.name
            }
        };
    }
}