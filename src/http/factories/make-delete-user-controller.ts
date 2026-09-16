import { PrismaUserRepository } from "@/repositories/prisma/prisma-user-repository";
import { DeleteUserUseCase } from "@/use-cases/user/delete-user-use-case";

export function makeDeleteUserController() {
    const userRepository = new PrismaUserRepository();
    const controller = new DeleteUserUseCase(userRepository);

    return controller;
}