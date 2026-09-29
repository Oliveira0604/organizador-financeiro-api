import { fastifyAdapter } from "@/adapters/fastify-adapter";
import { makeCreateCategoryController } from "@/http/factories/category/make-create-category-controller";
import { makeDeleteCategoryController } from "@/http/factories/category/make-delete-category-controller";
import { makeUpdateCategoryController } from "@/http/factories/category/make-update-category-controller";
import { verifyJWT } from "@/middleware/verify-jwt";
import type { FastifyInstance } from "fastify";

export async function categoryRoutes(app: FastifyInstance) {
    app.addHook("onRequest", verifyJWT);

    app.post("/category/create/:id", fastifyAdapter(makeCreateCategoryController()));
    app.patch("/category/update/:id", fastifyAdapter(makeUpdateCategoryController()));
    app.delete("/category/delete/:id", fastifyAdapter(makeDeleteCategoryController()));
}