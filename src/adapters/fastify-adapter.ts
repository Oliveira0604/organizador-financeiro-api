import type { Controller } from "@/http/controllers/controller";
import type { HttpRequest } from "@/http/controllers/http";
import type { FastifyReply, FastifyRequest } from "fastify";

export function fastifyAdapter(controller: Controller) {
    return async (request: FastifyRequest, reply: FastifyReply) => {
        const httpRequest: HttpRequest = {
            body: request.body,
            params: request.params,
            query: request.query,
            headers: request.headers
        };

        const httpResponse = await controller.handle(httpRequest);

        return reply
            .status(httpResponse.statusCode)
            .send(httpResponse.body);
    };
}