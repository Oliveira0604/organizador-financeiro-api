import type { HashComparer } from "@/cryptography/hash-comparer";
import { InvalidCredentialsError } from "@/errors/invalid-credentials-error";
import type { UserRepository } from "@/repositories/user-repository";
import type { TokenGenerator } from "@/tokens/token-generator-";

interface AuthenticateUserUseCaseRequest {
    phoneNumber: string
    password: string
}

interface AuthenticateUserUseCaseResponse {
    token: string
}

export class AuthenticateUserUseCase {
    constructor(
        private userRepository: UserRepository,
        private hashComparer: HashComparer,
        private tokenGenerator: TokenGenerator
    ) { }

    async execute({
        phoneNumber,
        password
    }: AuthenticateUserUseCaseRequest): Promise<AuthenticateUserUseCaseResponse> {

        const user = await this.userRepository.findByPhoneNumber(phoneNumber);

        if (!user) {
            throw new InvalidCredentialsError();
        }

        const doesThePasswordMatch = await this.hashComparer.compare(password, user.passwordHash);

        if (!doesThePasswordMatch) {
            throw new InvalidCredentialsError();
        }

        const token = await this.tokenGenerator.sign({
            sub: user.id
        });

        return {
            token
        };
    }
}
