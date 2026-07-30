import { InMemoryUserRepository } from "@/repositories/in-memory/in-memory-user-repository";
import { expect, describe, it, beforeEach } from "vitest";
import { CreateUserUseCase } from "./create-user-use-case";
import { UserAlreadyExistsError } from "@/errors/user-already-exists-error";

let userRepository: InMemoryUserRepository;
let createUserUseCase: CreateUserUseCase;

describe("Create User use case", () => {
    beforeEach(() => {
        userRepository = new InMemoryUserRepository();
        createUserUseCase = new CreateUserUseCase(userRepository);
    });

    it("should be able create a user", async () => {
        const { user } = await createUserUseCase.execute({
            name: "John doe",
            phoneNumber: "+55 11 9999-9999"
        });

        expect(user.id).toEqual(expect.any(String));
    });

    it("should not be able to create a user if the phone number already exists", async () => {
        const phoneNumber = "+55 11 9999-9999";

        await userRepository.create({
            name: "John Doe",
            phoneNumber,
        });

        await expect(() => createUserUseCase.execute({
            name: "John Doe",
            phoneNumber
        })).rejects.toBeInstanceOf(UserAlreadyExistsError);
    });

});