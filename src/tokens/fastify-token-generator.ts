import type { FastifyInstance } from "fastify";
import type { TokenGenerator } from "./token-generator-";

export class FastifyTokenGenerator implements TokenGenerator {
    constructor(
        private app: FastifyInstance
    ) { }

    async sign(payload: { sub: string }) {
        return this.app.jwt.sign(payload);
    }
}