import { InvalidCredentialsError } from "@/errors/invalid-credentials-error";
import type { User, UserRepository } from "@/repositories/user-repository";
import { compare } from "bcryptjs";

interface AuthenticateUserUseCaseRequest {
    phoneNumber: string
    password: string
}

interface AuthenticateUserUseCaseResponse {
    user: User
}

export class AuthenticateUserUseCase {
    constructor(
        private userRepository: UserRepository
    ) { }

    async execute({
        phoneNumber,
        password
    }: AuthenticateUserUseCaseRequest): Promise<AuthenticateUserUseCaseResponse> {

        const user = await this.userRepository.findByPhoneNumber(phoneNumber);

        if (!user) {
            throw new InvalidCredentialsError();
        }

        const doesThePasswordMatch = await compare(password, user.passwordHash);

        if (!doesThePasswordMatch) {
            throw new InvalidCredentialsError();
        }

        return {
            user
        };
    }
}

//TODO: Create the test for this use case.