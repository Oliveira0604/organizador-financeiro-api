import { fastifyAdapter } from "@/adapters/fastify-adapter";
import { makeCreateIncomeController } from "@/http/factories/incomes/make-create-income-controller";
import { makeFindManyIncomesByCategoryIdController } from "@/http/factories/incomes/make-find-many-incomes-by-category-id-controller";
import { makeFindManyIncomesByUserIdController } from "@/http/factories/incomes/make-find-many-incomes-by-user-id-controller";
import { makeGetPercentageByCategoryIdController } from "@/http/factories/incomes/make-get-percentage-by-category-id-controller";
import { makeGetTotalByCategoryIdController } from "@/http/factories/incomes/make-get-total-by-category-id-controller";
import { makeGetTotalByUserIdController } from "@/http/factories/incomes/make-get-total-by-user-id-controller";
import { verifyJWT } from "@/middleware/verify-jwt";
import type { FastifyInstance } from "fastify";

export function incomesRoutes(app: FastifyInstance) {
    app.addHook("onRequest", verifyJWT);

    app.get("/incomes/categoryid", fastifyAdapter(makeFindManyIncomesByCategoryIdController()));
    app.get("/incomes/userid", fastifyAdapter(makeFindManyIncomesByUserIdController()));
    app.get("/incomes/category/total", fastifyAdapter(makeGetTotalByCategoryIdController()));
    app.get("/incomes/user/total", fastifyAdapter(makeGetTotalByUserIdController()));
    app.get("/incomes/category/percentage", fastifyAdapter(makeGetPercentageByCategoryIdController()));
    app.post("/incomes/create", fastifyAdapter(makeCreateIncomeController()));
}