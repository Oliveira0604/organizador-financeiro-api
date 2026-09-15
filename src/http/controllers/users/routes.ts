import { makeCreateUserController } from "@/http/factories/make-create-user-controller";
import type { FastifyInstance } from "fastify";
import type { HttpRequest } from "../http";
import { makeUpdateUserController } from "@/http/factories/make-update-user-controller";

export async function userRoutes(app: FastifyInstance) {
    app.post("/users", async (request, reply) => {
        const httpRequest: HttpRequest = {
            body: request.body
        };

        const controller = makeCreateUserController();

        const httResponse = await controller.handle(httpRequest);

        return reply.status(httResponse.statusCode).send(httResponse.body);
    });

    app.patch("/users/:id", async (request, reply) => {
        const httpRequest: HttpRequest = {
            body: request.body,
            params: request.params
        };

        const controller = makeUpdateUserController();

        const httpResponse = await controller.handle(httpRequest);

        return reply.status(httpResponse.statusCode).send(httpResponse.body);
    });
}