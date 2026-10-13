import type { FastifyInstance } from "fastify";
import { userRoutes } from "./controllers/users/routes";
import { categoryRoutes } from "./controllers/category/routes";
import { expenseRoutes } from "./controllers/expenses/routes";
import { incomesRoutes } from "./controllers/incomes/routes";

export function routes(app: FastifyInstance) {
    app.register(userRoutes);
    app.register(categoryRoutes);
    app.register(expenseRoutes);
    app.register(incomesRoutes);
}