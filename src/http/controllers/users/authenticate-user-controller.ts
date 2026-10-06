import type { AuthenticateUserUseCase } from "@/use-cases/user/authenticate-user-use-case";
import type { Controller } from "../controller";
import z from "zod";
import type { HttpRequest, HttpResponse } from "../http";

const authenticateUserSchema = z.object({
    email: z.email(),
    password: z.string()
});

export class AuthenticateUserController implements Controller {
    constructor(
        private authenticateUserUseCase: AuthenticateUserUseCase
    ) { }

    async handle(request: HttpRequest): Promise<HttpResponse> {
        const { email, password } = authenticateUserSchema.parse(request.body);

        const { acessToken, refreshToken } = await this.authenticateUserUseCase.execute({
            email,
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