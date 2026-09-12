import { makeCreateUserController } from "@/http/factories/make-user-controller";
import type { FastifyInstance } from "fastify";
import type { HttpRequest } from "../http";

export async function userRoutes(app: FastifyInstance) {
    app.post("/users", async (request, reply) => {
        const httpRequest: HttpRequest = {
            body: request.body
        };

        const controller = makeCreateUserController();

        const httResponse = await controller.handle(httpRequest);

        return reply.status(httResponse.statusCode).send(httResponse.body);
    });
}