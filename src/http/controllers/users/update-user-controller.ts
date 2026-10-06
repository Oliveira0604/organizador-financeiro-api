import type { UpdateUserUseCase } from "@/use-cases/user/update-user-use-case";
import type { Controller } from "../controller";
import z from "zod";
import type { HttpRequest, HttpResponse } from "../http";

const paramsSchema = z.object({
    id: z.uuid(),
});

const updateUserSchema = z.object({
    name: z.string().trim().min(1).optional(),
    email: z.email().optional(),
    password: z.string().min(8).optional()
});

export class UpdateUserController implements Controller {
    constructor(
        private updateUserUseCase: UpdateUserUseCase
    ) { }

    async handle(request: HttpRequest): Promise<HttpResponse> {
        const { id } = paramsSchema.parse(request.params);
        const { name, email, password } = updateUserSchema.parse(request.body);

        const updatedUser = await this.updateUserUseCase.execute({
            userId: id,
            ...(name !== undefined && { name }),
            ...(email !== undefined && { email }),
            ...(password !== undefined && { password })
        });

        return {
            statusCode: 200,
            body: {
                id: updatedUser.user!.id,
                name: updatedUser.user!.name
            }
        };
    }
}
