import { fastifyAdapter } from "@/adapters/fastify-adapter";
import { makeCreateExpenseController } from "@/http/factories/expenses/make-create-expense-controller";
import { makeDeleteExpenseController } from "@/http/factories/expenses/make-delete-exepense-controller";
import { makeFindManyExpensesByCategoryIdController } from "@/http/factories/expenses/make-find-many-expenses-by-category-id-controller";
import { makeFindManyByUserIdBetweenDatesController } from "@/http/factories/expenses/make-find-many-expenses-by-user-id-between-dates-controller";
import { makeGetPercentageByCategoryController } from "@/http/factories/expenses/make-get-percentage-by-category-controller";
import { makeGetTotalByCategoryIdController } from "@/http/factories/expenses/make-get-total-by-category-id-controller";
import { makeUpdateExpenseController } from "@/http/factories/expenses/make-update-expense-controller";
import { verifyJWT } from "@/middleware/verify-jwt";
import type { FastifyInstance } from "fastify";

export async function expenseRoutes(app: FastifyInstance) {
    app.addHook("onRequest", verifyJWT);

    app.get("/expenses", fastifyAdapter(makeFindManyByUserIdBetweenDatesController()));
    app.get("/expenses/category", fastifyAdapter(makeFindManyExpensesByCategoryIdController()));
    app.get("/expenses/category/percentage", fastifyAdapter(makeGetPercentageByCategoryController()));
    app.get("/expenses/category/total", fastifyAdapter(makeGetTotalByCategoryIdController()));
    app.post("/expenses/create/:categoryId", fastifyAdapter(makeCreateExpenseController()));
    app.patch("/expenses/update", fastifyAdapter(makeUpdateExpenseController()));
    app.delete("/expenses/delete", fastifyAdapter(makeDeleteExpenseController()));
}