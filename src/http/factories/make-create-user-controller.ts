import { PrismaUserRepository } from "@/repositories/prisma/prisma-user-repository";
import { CreateUserUseCase } from "@/use-cases/user/create-user-use-case";
import { CreateUserController } from "../controllers/users/create-user-controller";

export function makeCreateUserController() {
    const userRepository = new PrismaUserRepository();
    const createUserUseCase = new CreateUserUseCase(userRepository);
    const controller = new CreateUserController(createUserUseCase);

    return controller;
}