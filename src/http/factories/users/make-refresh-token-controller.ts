import { app } from "@/app";
import { RefreshTokenController } from "@/http/controllers/users/refresh-token-controller";
import { FastifyTokenGenerator } from "@/tokens/fastify-token-generator";
import { RefreshTokenUseCase } from "@/use-cases/user/refresh-token-use-case";

export function makeRefreshTokenController() {
    const tokenGenerator = new FastifyTokenGenerator(app);
    const refreshTokenUseCase = new RefreshTokenUseCase(tokenGenerator);
    const controller = new RefreshTokenController(refreshTokenUseCase);

    return controller;
}