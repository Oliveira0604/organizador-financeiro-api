import type { TokenGenerator } from "@/tokens/token-generator-";

interface RefreshTokenUseCaseRequest {
    userId: string
}

interface RefreshTokenUseCaseResponse {
    acessToken: string
    refreshToken: string
}

export class RefreshTokenUseCase {
    constructor(
        private tokenGenerator: TokenGenerator
    ) { }

    async execute({
        userId
    }: RefreshTokenUseCaseRequest): Promise<RefreshTokenUseCaseResponse> {
        const acessToken = await this.tokenGenerator.signAccessToken({
            sub: userId
        });

        const refreshToken = await this.tokenGenerator.signRefreshToken({
            sub: userId
        });

        return {
            acessToken,
            refreshToken
        };

    }
}