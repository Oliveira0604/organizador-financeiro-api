import fastify from "fastify";

export const app = fastify();

import { ZodError, z } from "zod";
import { env } from "./env";
import { AppError } from "./errors/app-error";

app.setErrorHandler((error, _, reply) => {
    if (error instanceof ZodError) {
        return reply
            .status(400)
            .send({ message: "Validation error", issues: z.treeifyError(error) });
    }

    if (error instanceof AppError) {
        return reply
            .status(error.statusCode)
            .send({ message: error.message });
    }

    if (env.NODE_ENV !== "production") {
        console.error(error);
    }

    return reply.status(500).send({ message: "Internal server error" });
});