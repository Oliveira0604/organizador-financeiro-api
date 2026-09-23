import type { HashGenerator } from "@/cryptography/hash-generator";
import { PasswordAlreadyExistsError } from "@/errors/password-already-exists-error";
import { ResourceNotFoundError } from "@/errors/resource-not-found-error";
import type { UserRepository } from "@/repositories/user-repository";

interface SetInitialPasswordUseCaseRequest {
    phoneNumber: string
    password: string
}


export class SetInitialPasswordUseCase {
    constructor(
        private userRepository: UserRepository,
        private hashGenerator: HashGenerator
    ) { }

    async execute({
        phoneNumber,
        password
    }: SetInitialPasswordUseCaseRequest): Promise<void> {
        const user = await this.userRepository.findByPhoneNumber(phoneNumber);

        if (!user) {
            throw new ResourceNotFoundError();
        }

        if (user.passwordHash) {
            throw new PasswordAlreadyExistsError();
        }

        const passwordHash = await this.hashGenerator.hash(password);

        await this.userRepository.updatePassword(
            user.id,
            passwordHash
        );
    }
}

//TODO: Create the test coverage for this use case 

// TODO: Add two-step verification (e.g. OTP via WhatsApp) before allowing
// password creation. Currently, anyone who knows a user's phone number
// could set that user's initial password, since there's no proof of identity.