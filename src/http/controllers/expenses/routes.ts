import { fastifyAdapter } from "@/adapters/fastify-adapter";
import { makeCreateExpenseController } from "@/http/factories/expenses/make-create-expense-controller";
import { verifyJWT } from "@/middleware/verify-jwt";
import type { FastifyInstance } from "fastify";

export async function expenseRoutes(app: FastifyInstance) {
    app.addHook("onRequest", verifyJWT);

    app.post("/expenses/create/:categoryId", fastifyAdapter(makeCreateExpenseController()));
}