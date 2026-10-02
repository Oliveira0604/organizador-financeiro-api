import type { FastifyInstance } from "fastify";
import type { TokenGenerator } from "./token-generator-";

export class FastifyTokenGenerator implements TokenGenerator {
    constructor(
        private app: FastifyInstance
    ) { }

    async signAccessToken(payload: { sub: string }) {
        return this.app.jwt.sign(payload);
    }

    async signRefreshToken(payload: { sub: string; }) {
        return this.app.jwt.sign(payload, {
            expiresIn: "7d"
        });
    }
}

//TODO: CREATE THE ROUTE THAT WILL REFRESH THE TOKEN