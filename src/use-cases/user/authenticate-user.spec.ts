import { InMemoryUserRepository } from "@/repositories/in-memory/in-memory-user-repository";
import { beforeEach, describe, expect, it } from "vitest";
import { AuthenticateUserUseCase } from "./authenticate-user-use-case";
import { hash } from "bcryptjs";
import { InvalidCredentialsError } from "@/errors/invalid-credentials-error";

let userRepository: InMemoryUserRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;

describe("Authenticate User Use Case", () => {
    beforeEach(() => {
        userRepository = new InMemoryUserRepository();
        authenticateUserUseCase = new AuthenticateUserUseCase(userRepository);
    });

    it("should be able to authenticate a user", async () => {
        await userRepository.create({
            name: "Nathan",
            phoneNumber: "+55 11 9999-9999",
            passwordHash: await hash("123456", 6)
        });

        const { user } = await authenticateUserUseCase.execute({
            phoneNumber: "+55 11 9999-9999",
            password: "123456"
        });

        expect(user.id).toEqual(expect.any(String));
    });

    it("should not be able to authenticate an user if the user doesn't exist", async () => {
        await expect(
            authenticateUserUseCase.execute({
                phoneNumber: "+55 11 9999-9999",
                password: "123456"
            })
        ).rejects.toBeInstanceOf(InvalidCredentialsError);
    });

    it("should not be able to authenticate an user if the password is wrong", async () => {
        await userRepository.create({
            name: "Nathan",
            phoneNumber: "+55 11 9999-9999",
            passwordHash: await hash("654321", 6)
        });

        await expect(
            authenticateUserUseCase.execute({
                phoneNumber: "+55 11 9999-9999",
                password: "123456"
            })
        ).rejects.toBeInstanceOf(InvalidCredentialsError);
    });
});