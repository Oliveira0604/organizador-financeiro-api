import type { FastifyInstance } from "fastify";
import { userRoutes } from "./controllers/users/routes";

export async function routes(app: FastifyInstance) {
    app.register(userRoutes);
}