import { InMemoryUserRepository } from "@/repositories/in-memory/in-memory-user-repository";
import { describe, expect, it, beforeEach } from "vitest";
import { UpdateUserUseCase } from "./update-user-use-case";

let userRepository: InMemoryUserRepository;
let updateUserUseCase: UpdateUserUseCase;



describe("Update User Use Case", () => {
    beforeEach(async () => {
        userRepository = new InMemoryUserRepository();
        updateUserUseCase = new UpdateUserUseCase(userRepository);
    });

    it("should be able to update user name", async () => {
        const user = await userRepository.create({
            name: "Nathan de Oliveira",
            phoneNumber: "+55 11 9999-9999"
        });

        await updateUserUseCase.execute({
            userId: user.id,
            name: "Nathan Silva"
        });

        expect(user.name).toEqual("Nathan Silva");
    });

    it("should be able to update user phone number", async () => {
        const user = await userRepository.create({
            name: "Nathan de Oliveira",
            phoneNumber: "+55 11 9999-9999"
        });

        await updateUserUseCase.execute({
            userId: user.id,
            name: "Nathan de Oliveira",
            phoneNumber: "+55 11 8888-8888"
        });
    });
});