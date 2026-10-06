import { InMemoryUserRepository } from "@/repositories/in-memory/in-memory-user-repository";
import { describe, expect, it, beforeEach } from "vitest";
import { UpdateUserUseCase } from "./update-user-use-case";
import { BcryptHasher } from "@/cryptography/bcrypt-hasher";

let userRepository: InMemoryUserRepository;
let bcryptHasher: BcryptHasher;
let updateUserUseCase: UpdateUserUseCase;



describe("Update User Use Case", () => {
    beforeEach(async () => {
        userRepository = new InMemoryUserRepository();
        bcryptHasher = new BcryptHasher();
        updateUserUseCase = new UpdateUserUseCase(userRepository, bcryptHasher);
    });

    it("should be able to update user name", async () => {
        const user = await userRepository.create({
            name: "Nathan de Oliveira",
            email: "nathan@email.com",
            passwordHash: "12345678"
        });

        await updateUserUseCase.execute({
            userId: user.id,
            name: "Nathan Silva"
        });

        expect(user.name).toEqual("Nathan Silva");
    });

    it("should be able to update user email", async () => {
        const user = await userRepository.create({
            name: "Nathan de Oliveira",
            email: "nathan@email.com",
            passwordHash: "12345678"
        });

        await updateUserUseCase.execute({
            userId: user.id,
            email: "nathan2@email.com"
        });

        expect(user.email).toEqual("nathan2@email.com");
    });

    it("should be able to update user password", async () => {
        const user = await userRepository.create({
            name: "Nathan de Oliveira",
            email: "nathan@email.com",
            passwordHash: "12345678"
        });

        await updateUserUseCase.execute({
            userId: user.id,
            password: "87654321"
        });

        const updatedUser = await userRepository.findById(user.id);

        const isPasswordHashEquals = await bcryptHasher.compare(
            "87654321",
            updatedUser!.passwordHash!
        );

        expect(isPasswordHashEquals).toEqual(true);
    });
});