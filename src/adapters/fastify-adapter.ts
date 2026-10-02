import type { Controller } from "@/http/controllers/controller";
import type { HttpRequest } from "@/http/controllers/http";
import type { FastifyReply, FastifyRequest } from "fastify";

export function fastifyAdapter(controller: Controller) {
    return async (request: FastifyRequest, reply: FastifyReply) => {
        const httpRequest: HttpRequest = {
            body: request.body,
            params: request.params,
            query: request.query,
            headers: request.headers,
            cookies: request.cookies,
            ...(request.user && {
                user: {
                    id: request.user.sub
                }
            })
        };

        const httpResponse = await controller.handle(httpRequest);

        if (httpResponse.cookies) {
            reply.setCookie(httpResponse.cookies.name, httpResponse.cookies.value, {
                path: httpResponse.cookies.path,
                secure: httpResponse.cookies.secure,
                sameSite: httpResponse.cookies.sameSite,
                httpOnly: httpResponse.cookies.httpOnly
            });
        }

        return reply
            .status(httpResponse.statusCode)
            .send(httpResponse.body);
    };
}