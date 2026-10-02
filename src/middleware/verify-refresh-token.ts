import { JwtError } from "@/errors/jwt-error";
import type { FastifyRequest } from "fastify";

export async function verifyRefreshToken(request: FastifyRequest) {
    try {

        await request.jwtVerify({
            onlyCookie: true
        });

    } catch {
        throw new JwtError();
    }
}