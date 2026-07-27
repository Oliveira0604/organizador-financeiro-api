import { InMemoryUserRepository } from "@/repositories/in-memory/in-memory-user-repository";
import { expect, describe, it, beforeEach } from "vitest";
import { CreateUserUseCase } from "./create-user";

let userRepository: InMemoryUserRepository;
let createUserUseCase: CreateUserUseCase;

describe("Create User use case", () => {
    beforeEach(() => {
        userRepository = new InMemoryUserRepository();
        createUserUseCase = new CreateUserUseCase(userRepository);
    });

    it("should create a user", async () => {
        const { user } = await createUserUseCase.execute({
            name: "John doe",
            phoneNumber: "+55 11 9999-9999"
        });

        expect(user.id).toEqual(expect.any(String));
    });
});