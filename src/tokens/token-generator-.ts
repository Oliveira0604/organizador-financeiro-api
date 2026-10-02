export interface TokenGenerator {
    signAccessToken(payload: { sub: string }): Promise<string>
    signRefreshToken(payload: { sub: string }): Promise<string>
}