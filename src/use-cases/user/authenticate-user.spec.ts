import { InMemoryUserRepository } from "@/repositories/in-memory/in-memory-user-repository";
import { beforeEach, describe, expect, it } from "vitest";
import { AuthenticateUserUseCase } from "./authenticate-user-use-case";
import { InvalidCredentialsError } from "@/errors/invalid-credentials-error";
import { FakeHasher } from "@/cryptography/fake-hasher";
import { FakeTokenGenerator } from "@/tokens/fake-token-generator";

let userRepository: InMemoryUserRepository;
let hash: FakeHasher;
let tokenGenerator: FakeTokenGenerator;
let authenticateUserUseCase: AuthenticateUserUseCase;

describe("Authenticate User Use Case", () => {
    beforeEach(() => {
        userRepository = new InMemoryUserRepository();
        hash = new FakeHasher();
        tokenGenerator = new FakeTokenGenerator();
        authenticateUserUseCase = new AuthenticateUserUseCase(userRepository, hash, tokenGenerator);
    });

    it("should be able to authenticate a user", async () => {
        await userRepository.create({
            name: "Nathan",
            phoneNumber: "+55 11 9999-9999",
            passwordHash: await hash.hash("123456")
        });

        const { user, token } = await authenticateUserUseCase.execute({
            phoneNumber: "+55 11 9999-9999",
            password: "123456"
        });

        expect(user.id).toEqual(expect.any(String));
        expect(token).toEqual(expect.any(String));
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
            passwordHash: await hash.hash("654321")
        });

        await expect(
            authenticateUserUseCase.execute({
                phoneNumber: "+55 11 9999-9999",
                password: "123456"
            })
        ).rejects.toBeInstanceOf(InvalidCredentialsError);
    });
});