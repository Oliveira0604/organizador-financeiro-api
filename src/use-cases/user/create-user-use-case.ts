import type { User, UserRepository } from "@/repositories/user-repository";
import { UserAlreadyExistsError } from "@/errors/user-already-exists-error";

interface CreateUserUseCaseRequest {
    name: string,
    phoneNumber: string
}

interface CreateUserUseCaseResponse {
    user: User
}

export class CreateUserUseCase {
    constructor(
        private userRepository: UserRepository
    ) { }

    async execute({
        name,
        phoneNumber
    }: CreateUserUseCaseRequest): Promise<CreateUserUseCaseResponse> {
        const doesTheUserAlreadyExists = await this.userRepository.findByPhoneNumber(phoneNumber);

        if (doesTheUserAlreadyExists) {
            throw new UserAlreadyExistsError();
        }

        const user = await this.userRepository.create({
            name,
            phoneNumber
        });

        return {
            user,
        };
    }
}