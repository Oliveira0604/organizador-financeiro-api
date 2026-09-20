import type { User, UserRepository } from "@/repositories/user-repository";
import { UserAlreadyExistsError } from "@/errors/user-already-exists-error";
import { hash } from "bcryptjs";

interface CreateUserUseCaseRequest {
    name: string,
    phoneNumber: string,
    password: string
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
        phoneNumber,
        password
    }: CreateUserUseCaseRequest): Promise<CreateUserUseCaseResponse> {

        const passwordHash = await hash(password, 6);

        const doesTheUserAlreadyExists = await this.userRepository.findByPhoneNumber(phoneNumber);

        if (doesTheUserAlreadyExists) {
            throw new UserAlreadyExistsError();
        }

        const user = await this.userRepository.create({
            name,
            phoneNumber,
            passwordHash
        });

        return {
            user,
        };
    }
}