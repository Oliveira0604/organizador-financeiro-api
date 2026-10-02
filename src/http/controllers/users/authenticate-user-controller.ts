import type { AuthenticateUserUseCase } from "@/use-cases/user/authenticate-user-use-case";
import type { Controller } from "../controller";
import z from "zod";
import type { HttpRequest, HttpResponse } from "../http";

const authenticateUserSchema = z.object({
    phoneNumber: z.string(),
    password: z.string()
});

export class AuthenticateUserController implements Controller {
    constructor(
        private authenticateUserUseCase: AuthenticateUserUseCase
    ) { }

    async handle(request: HttpRequest): Promise<HttpResponse> {
        const { phoneNumber, password } = authenticateUserSchema.parse(request.body);

        const { acessToken, refreshToken } = await this.authenticateUserUseCase.execute({
            phoneNumber,
            password
        });

        return {
            statusCode: 200,
            body: {
                acessToken,
            },
            cookies: {
                name: "refreshToken",
                value: refreshToken,
                path: "/",
                secure: true,
                sameSite: "lax",
                httpOnly: true
            }
        };
    }
}