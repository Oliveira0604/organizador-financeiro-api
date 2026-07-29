import { ResourceNotFoundError } from "@/errors/resource-not-found-error";
import type { UserRepository } from "@/repositories/user-repository";

export class DeleteUserUseCase {
    constructor(private userRepository: UserRepository) { }

    async execute(id: string): Promise<void> {
        const user = await this.userRepository.findById(id);

        if (!user) {
            throw new ResourceNotFoundError();
        }

        await this.userRepository.delete(id);
    }
}