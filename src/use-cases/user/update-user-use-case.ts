import type { BcryptHasher } from "@/cryptography/bcrypt-hasher";
import { ResourceNotFoundError } from "@/errors/resource-not-found-error";
import type { User, UpdateUserData, UserRepository } from "@/repositories/user-repository";

interface UpdateUserUseCaseRequest {
    userId: string,
    name?: string,
    email?: string
    password?: string
}

interface UpdateUserUseCaseResponse {
    user: User | null
}


export class UpdateUserUseCase {
    constructor(
        private userRepository: UserRepository,
        private bcryptHasher: BcryptHasher
    ) { }

    async execute({
        userId,
        name,
        email,
        password
    }: UpdateUserUseCaseRequest): Promise<UpdateUserUseCaseResponse> {
        const user = await this.userRepository.findById(userId);

        if (!user) {
            throw new ResourceNotFoundError();
        }

        const data: UpdateUserData = {};

        if (name) {
            data.name = name;
        };

        if (email) {
            data.email = email;
        }

        if (password) {
            const passwordHash = await this.bcryptHasher.hash(password);
            data.passwordHash = passwordHash;
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