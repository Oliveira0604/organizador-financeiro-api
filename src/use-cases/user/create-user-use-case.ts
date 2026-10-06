import type { User, UserRepository } from "@/repositories/user-repository";
import { UserAlreadyExistsError } from "@/errors/user-already-exists-error";
import type { HashGenerator } from "@/cryptography/hash-generator";

interface CreateUserUseCaseRequest {
    name: string,
    email: string,
    password: string
}

interface CreateUserUseCaseResponse {
    user: User
}

export class CreateUserUseCase {
    constructor(
        private userRepository: UserRepository,
        private hashGenerator: HashGenerator
    ) { }

    async execute({
        name,
        email,
        password
    }: CreateUserUseCaseRequest): Promise<CreateUserUseCaseResponse> {

        const passwordHash = await this.hashGenerator.hash(password);

        const doesTheUserAlreadyExists = await this.userRepository.findByEmail(email);

        if (doesTheUserAlreadyExists) {
            throw new UserAlreadyExistsError();
        }

        const user = await this.userRepository.create({
            name,
            email,
            passwordHash
        });

        return {
            user,
        };
    }
}