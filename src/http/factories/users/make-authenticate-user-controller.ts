import { BcryptHasher } from "@/cryptography/bcrypt-hasher";
import { PrismaUserRepository } from "@/repositories/prisma/prisma-user-repository";
import { FastifyTokenGenerator } from "@/tokens/fastify-token-generator";
import { AuthenticateUserUseCase } from "@/use-cases/user/authenticate-user-use-case";
import { app } from "@/app";
import { AuthenticateUserController } from "@/http/controllers/users/authenticate-user-controller";


export function makeAuthenticateUserController() {
    const userRepository = new PrismaUserRepository();
    const bcryptHasher = new BcryptHasher();
    const tokenGenerator = new FastifyTokenGenerator(app);
    const authenticateUserUseCase = new AuthenticateUserUseCase(userRepository, bcryptHasher, tokenGenerator);
    const controller = new AuthenticateUserController(authenticateUserUseCase);

    return controller;
}