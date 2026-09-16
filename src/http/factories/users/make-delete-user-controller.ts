import { PrismaUserRepository } from "@/repositories/prisma/prisma-user-repository";
import { DeleteUserUseCase } from "@/use-cases/user/delete-user-use-case";
import { DeleteUserController } from "@/http/controllers/users/delete-user-controller";

export function makeDeleteUserController() {
    const userRepository = new PrismaUserRepository();
    const deleteUserUseCase = new DeleteUserUseCase(userRepository);
    const controller = new DeleteUserController(deleteUserUseCase);

    return controller;
}