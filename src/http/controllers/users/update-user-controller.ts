import type { UpdateUserUseCase } from "@/use-cases/user/update-user-use-case";
import type { Controller } from "../controller";
import z from "zod";
import type { HttpRequest, HttpResponse } from "../http";
import { normalizePhoneNumber } from "@/utils/normalizePhoneNumber";

const paramsSchema = z.object({
    id: z.uuid(),
});

const updateUserSchema = z.object({
    name: z.string().trim().min(1).optional(),
    phoneNumber: z.string().trim().min(15).optional()
});

export class UpdateUserController implements Controller {
    constructor(
        private updateUserUseCase: UpdateUserUseCase
    ) { }

    async handle(request: HttpRequest): Promise<HttpResponse> {
        const { id } = paramsSchema.parse(request.params);
        const { name, phoneNumber } = updateUserSchema.parse(request.body);

        const updatedUser = await this.updateUserUseCase.execute({
            userId: id,
            ...(name !== undefined && { name }),
            ...(phoneNumber !== undefined && {
                phoneNumber: normalizePhoneNumber(phoneNumber)
            })
        });

        return {
            statusCode: 200,
            body: {
                updatedUser
            }
        };
    }
}

//TODO: Fix the optional part (is not accepting the optional from zod because my interface is optional or string and zod is optional or undefined)