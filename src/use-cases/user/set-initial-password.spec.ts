import { FakeHasher } from "@/cryptography/fake-hasher";
import { InMemoryUserRepository } from "@/repositories/in-memory/in-memory-user-repository";
import { beforeEach, describe, expect, it } from "vitest";
import { SetInitialPasswordUseCase } from "./set-initial-password-use-case";
import { ResourceNotFoundError } from "@/errors/resource-not-found-error";
import { PasswordAlreadyExistsError } from "@/errors/password-already-exists-error";

let userRepository: InMemoryUserRepository;
let hashGenerator: FakeHasher;
let setInitialPasswordUseCase: SetInitialPasswordUseCase;

describe("Set Initial Password Use Case", () => {
    beforeEach(() => {
        userRepository = new InMemoryUserRepository();
        hashGenerator = new FakeHasher();
        setInitialPasswordUseCase = new SetInitialPasswordUseCase(userRepository, hashGenerator);
    });

    it("should be able to set an initial password for a user", async () => {
        await userRepository.create({
            name: "Nathan",
            phoneNumber: "+551199999-9999"
        });

        await setInitialPasswordUseCase.execute({
            phoneNumber: "+551199999-9999",
            password: "12345678"
        });

        const user = await userRepository.findByPhoneNumber("+551199999-9999");

        expect(user!.passwordHash).toEqual("12345678-hashed");

    });

    it("should not be able to set an initial password if the user doesn't exist", async () => {
        await expect(
            setInitialPasswordUseCase.execute({
                phoneNumber: "+551199999-9999",
                password: "12345678"
            })
        ).rejects.toBeInstanceOf(ResourceNotFoundError);
    });

    it("should not be able to set a password if already exists", async () => {
        await userRepository.create({
            name: "Nathan",
            phoneNumber: "+551199999-9999",
            passwordHash: "12345678"
        });

        await expect(
            setInitialPasswordUseCase.execute({
                phoneNumber: "+551199999-9999",
                password: "12345678"
            })
        ).rejects.toBeInstanceOf(PasswordAlreadyExistsError);
    });
});