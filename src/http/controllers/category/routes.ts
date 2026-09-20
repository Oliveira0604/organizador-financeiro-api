import { fastifyAdapter } from "@/adapters/fastify-adapter";
import { makeCreateCategoryController } from "@/http/factories/category/make-create-category-controller";
import { makeUpdateCategoryController } from "@/http/factories/category/make-update-category-controller";
import type { FastifyInstance } from "fastify";

export async function categoryRoutes(app: FastifyInstance) {
    app.post("/category/create/:id", fastifyAdapter(makeCreateCategoryController()));
    app.patch("/category/update/:id", fastifyAdapter(makeUpdateCategoryController()));
}