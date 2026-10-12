import { fastifyAdapter } from "@/adapters/fastify-adapter";
import { makeCreateExpenseController } from "@/http/factories/expenses/make-create-expense-controller";
import { makeFindManyExpensesByCategoryIdController } from "@/http/factories/expenses/make-find-many-expenses-by-category-id-controller";
import { makeFindManyByUserIdBetweenDatesController } from "@/http/factories/expenses/make-find-many-expenses-by-user-id-between-dates-controller";
import { makeGetPercentageByCategoryController } from "@/http/factories/expenses/make-get-percentage-by-category-controller";
import { verifyJWT } from "@/middleware/verify-jwt";
import type { FastifyInstance } from "fastify";

export async function expenseRoutes(app: FastifyInstance) {
    app.addHook("onRequest", verifyJWT);

    app.get("/expenses", fastifyAdapter(makeFindManyByUserIdBetweenDatesController()));
    app.get("/expenses/category", fastifyAdapter(makeFindManyExpensesByCategoryIdController()));
    app.get("/expenses/category/percentage", fastifyAdapter(makeGetPercentageByCategoryController()));
    app.post("/expenses/create/:categoryId", fastifyAdapter(makeCreateExpenseController()));
}