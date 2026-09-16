import type { FastifyInstance } from "fastify";
import { userRoutes } from "./controllers/users/routes";
import { categoryRoutes } from "./controllers/category/routes";

export async function routes(app: FastifyInstance) {
    app.register(userRoutes);
    app.register(categoryRoutes);
}