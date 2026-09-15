import { PrismaUserRepository } from "@/repositories/prisma/prisma-user-repository";
import { UpdateUserUseCase } from "@/use-cases/user/update-user-use-case";
import { UpdateUserController } from "../controllers/users/update-user-controller";

export function makeUpdateUserController() {
    const userRepository = new PrismaUserRepository();
    const updateUserUseCase = new UpdateUserUseCase(userRepository);
    const controller = new UpdateUserController(updateUserUseCase);

    return controller;
}