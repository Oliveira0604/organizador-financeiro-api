import { PrismaUserRepository } from "@/repositories/prisma/prisma-user-repository";
import { CreateUserUseCase } from "@/use-cases/user/create-user-use-case";
import { CreateUserController } from "@/http/controllers/users/create-user-controller";
import { BcryptHasher } from "@/cryptography/bcrypt-hasher";


export function makeCreateUserController() {
    const userRepository = new PrismaUserRepository();
    const hashGenerator = new BcryptHasher();
    const createUserUseCase = new CreateUserUseCase(userRepository, hashGenerator);
    const controller = new CreateUserController(createUserUseCase);

    return controller;
}