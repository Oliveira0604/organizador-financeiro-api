import { ResourceNotFoundError } from "@/errors/resource-not-found-error";
import type { User, UpdateUserData, UserRepository } from "@/repositories/user-repository";

interface UpdateUserUseCaseRequest {
    userId: string,
    name?: string,
    phoneNumber?: string
}

interface UpdateUserUseCaseResponse {
    user: User | null
}


export class UpdateUserUseCase {
    constructor(private userRepository: UserRepository) { }

    async execute({
        userId,
        name,
        phoneNumber,
    }: UpdateUserUseCaseRequest): Promise<UpdateUserUseCaseResponse> {
        const user = await this.userRepository.findById(userId);

        if (!user) {
            throw new ResourceNotFoundError();
        }

        const data: UpdateUserData = {};

        if (name) {
            data.name = name;
        };

        if (phoneNumber) {
            data.phoneNumber = phoneNumber;
        }

        const updatedUser = await this.userRepository.update(
            user.id,
            data
        );

        return {
            user: updatedUser
        };
    }
}