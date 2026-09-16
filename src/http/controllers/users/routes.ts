import type { FastifyInstance } from "fastify";
import { fastifyAdapter } from "@/adapters/fastify-adapter";
import { makeCreateUserController } from "@/http/factories/users/make-create-user-controller";
import { makeUpdateUserController } from "@/http/factories/users/make-update-user-controller";
import { makeDeleteUserController } from "@/http/factories/users/make-delete-user-controller";

export async function userRoutes(app: FastifyInstance) {
    app.post("/users/create", fastifyAdapter(makeCreateUserController()));
    app.patch("/users/update/:id", fastifyAdapter(makeUpdateUserController()));
    app.delete("/users/delete/:id", fastifyAdapter(makeDeleteUserController()));
}