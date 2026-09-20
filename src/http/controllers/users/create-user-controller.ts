import type { CreateUserUseCase } from "@/use-cases/user/create-user-use-case";
import type { Controller } from "../controller";
import type { HttpRequest, HttpResponse } from "../http";
import z from "zod";

const createUserSchema = z.object({
    name: z.string(),
    phoneNumber: z.string(),
    password: z.string().min(8)
});

export class CreateUserController implements Controller {
    constructor(
        private createUserUseCase: CreateUserUseCase
    ) { }

    async handle(request: HttpRequest): Promise<HttpResponse> {

        const { name, phoneNumber, password } = createUserSchema.parse(request.body);


        const user = await this.createUserUseCase.execute({
            name,
            phoneNumber,
            password
        });

        return {
            statusCode: 201,
            body: {
                user
            }
        };
    }

}
