import { InMemoryUserRepository } from "@/repositories/in-memory/in-memory-user-repository";
import { describe, it, expect, beforeEach } from "vitest";
import { DeleteUserUseCase } from "./delete-user-use-case";

let userRepository: InMemoryUserRepository;
let deleteUserUseCase: DeleteUserUseCase;

describe("Delete User Use Case", () => {
    beforeEach(() => {
        userRepository = new InMemoryUserRepository();
        deleteUserUseCase = new DeleteUserUseCase(userRepository);
    });

    it("should be able to delete a user", async () => {
        const user = await userRepository.create({
            name: "Nathan de Oliveira",
            email: "nathan@email.com",
            passwordHash: "12345678"
        });

        await deleteUserUseCase.execute(user.id);

        expect(user.deletedAt).toEqual(expect.any(Date));
    });
});