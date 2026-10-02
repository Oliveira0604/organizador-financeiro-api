import type { FastifyInstance } from "fastify";
import { fastifyAdapter } from "@/adapters/fastify-adapter";
import { makeCreateUserController } from "@/http/factories/users/make-create-user-controller";
import { makeUpdateUserController } from "@/http/factories/users/make-update-user-controller";
import { makeDeleteUserController } from "@/http/factories/users/make-delete-user-controller";
import { makeAuthenticateUserController } from "@/http/factories/users/make-authenticate-user-controller";
import { verifyJWT } from "@/middleware/verify-jwt";
import { verifyRefreshToken } from "@/middleware/verify-refresh-token";
import { makeRefreshTokenController } from "@/http/factories/users/make-refresh-token-controller";

export async function userRoutes(app: FastifyInstance) {
    app.post("/users/create", fastifyAdapter(makeCreateUserController()));
    app.post("/users/session", fastifyAdapter(makeAuthenticateUserController()));
    app.patch("/users/token/refresh", { onRequest: verifyRefreshToken }, fastifyAdapter(makeRefreshTokenController()));

    // Authenticated
    app.addHook("onRequest", verifyJWT);
    app.patch("/users/update/:id", fastifyAdapter(makeUpdateUserController()));
    app.delete("/users/delete/:id", fastifyAdapter(makeDeleteUserController()));
}