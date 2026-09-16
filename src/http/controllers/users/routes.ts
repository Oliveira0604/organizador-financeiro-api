import { makeCreateUserController } from "@/http/factories/make-create-user-controller";
import type { FastifyInstance } from "fastify";
import { makeUpdateUserController } from "@/http/factories/make-update-user-controller";
import { makeDeleteUserController } from "@/http/factories/make-delete-user-controller";
import { fastifyAdapter } from "@/adapters/fastify-adapter";

export async function userRoutes(app: FastifyInstance) {
    app.post("/users", fastifyAdapter(makeCreateUserController()));

    app.patch("/users/update/:id", fastifyAdapter(makeUpdateUserController()));

    app.delete("/users/delete/:id", fastifyAdapter(makeDeleteUserController()));
}