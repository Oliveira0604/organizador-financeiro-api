import { fastifyAdapter } from "@/adapters/fastify-adapter";
import { makeCreateIncomeController } from "@/http/factories/incomes/make-create-income-controller";
import { makeFindManyIncomesByCategoryIdController } from "@/http/factories/incomes/make-find-many-incomes-by-category-id-controller";
import { makeFindManyIncomesByUserIdController } from "@/http/factories/incomes/make-find-many-incomes-by-user-id-controller";
import { verifyJWT } from "@/middleware/verify-jwt";
import type { FastifyInstance } from "fastify";

export function incomesRoutes(app: FastifyInstance) {
    app.addHook("onRequest", verifyJWT);

    app.get("/incomes/categoryid", fastifyAdapter(makeFindManyIncomesByCategoryIdController()));
    app.get("/incomes/userid", fastifyAdapter(makeFindManyIncomesByUserIdController()));
    app.post("/incomes/create", fastifyAdapter(makeCreateIncomeController()));
}