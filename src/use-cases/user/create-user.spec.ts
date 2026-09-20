import { InMemoryUserRepository } from "@/repositories/in-memory/in-memory-user-repository";
import { expect, describe, it, beforeEach } from "vitest";
import { CreateUserUseCase } from "./create-user-use-case";
import { UserAlreadyExistsError } from "@/errors/user-already-exists-error";
import { FakeHasher } from "@/cryptography/fake-hasher";

let userRepository: InMemoryUserRepository;
let hash: FakeHasher;
let createUserUseCase: CreateUserUseCase;

describe("Create User use case", () => {
    beforeEach(() => {
        userRepository = new InMemoryUserRepository();
        hash = new FakeHasher();
        createUserUseCase = new CreateUserUseCase(userRepository, hash);
    });

    it("should hash a password before saving it", async () => {
        const user = await userRepository.create({
            name: "Nathan",
            phoneNumber: "+55 11 9999-9999",
            passwordHash: await hash.hash("123456")
        });

        expect(user.passwordHash).toEqual("123456-hashed");
    });

    it("should be able create a user", async () => {
        const { user } = await createUserUseCase.execute({
            name: "Nathan",
            phoneNumber: "+55 11 9999-9999",
            password: "123456"
        });

        expect(user.id).toEqual(expect.any(String));
    });

    it("should not be able to create a user if the phone number already exists", async () => {
        const phoneNumber = "+55 11 9999-9999";

        await userRepository.create({
            name: "Nathan",
            phoneNumber,
            passwordHash: "123456"
        });

        await expect(() => createUserUseCase.execute({
            name: "Nathan",
            phoneNumber,
            password: "123456"
        })).rejects.toBeInstanceOf(UserAlreadyExistsError);
    });

});