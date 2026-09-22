import { JwtError } from "@/errors/jwt-error";
import type { FastifyRequest } from "fastify";

export async function verifyJWT(request: FastifyRequest) {
    try {
        await request.jwtVerify();
    } catch {
        throw new JwtError;
    }
}