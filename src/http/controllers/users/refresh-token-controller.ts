import type { Controller } from "../controller";
import type { HttpRequest, HttpResponse } from "../http";
import type { RefreshTokenUseCase } from "@/use-cases/user/refresh-token-use-case";

export class RefreshTokenController implements Controller {
    constructor(
        private refreshTokenUseCase: RefreshTokenUseCase
    ) { }

    async handle(request: HttpRequest): Promise<HttpResponse> {
        const { acessToken, refreshToken } = await this.refreshTokenUseCase.execute({
            userId: request.user!.id
        });

        return {
            statusCode: 200,
            body: {
                acessToken
            },
            cookies: {
                name: "refreshToken",
                value: refreshToken,
                httpOnly: true,
                secure: true,
                sameSite: "lax",
                path: "/"
            }
        };
    }
}