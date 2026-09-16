import type { DeleteUserUseCase } from "@/use-cases/user/delete-user-use-case";
import type { Controller } from "../controller";
import type { HttpRequest } from "../http";
import type { HttpResponse } from "../http";
import z from "zod";

const deleteUserSchema = z.object({
    id: z.string()
});

export class DeleteUserController implements Controller {
    constructor(
        private deleteUserUseCase: DeleteUserUseCase
    ) { }

    async handle(request: HttpRequest): Promise<HttpResponse> {

        const { id } = deleteUserSchema.parse(request.params);

        await this.deleteUserUseCase.execute(
            id
        );

        return {
            statusCode: 204
        };
    }
}