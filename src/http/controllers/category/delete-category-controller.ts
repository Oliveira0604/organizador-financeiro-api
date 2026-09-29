import type { DeleteCategoryUseCase } from "@/use-cases/category/delete-category-use-case";
import type { Controller } from "../controller";
import type { HttpRequest, HttpResponse } from "../http";
import z from "zod";

const deleteCategorySchema = z.object({
    id: z.string()
});

export class DeleteCategoryController implements Controller {
    constructor(
        private deleteCategoryUseCase: DeleteCategoryUseCase
    ) { }

    async handle(request: HttpRequest): Promise<HttpResponse> {
        const { id } = deleteCategorySchema.parse(request.params);
        const userId = request.user!.id;

        await this.deleteCategoryUseCase.execute({
            id,
            userId
        });

        return {
            statusCode: 200
        };
    }
}

//TODO: I need to find a way to put the user ID here.
//25d83b55-bc9c-40e6-9a1d-28ec02e89bf5