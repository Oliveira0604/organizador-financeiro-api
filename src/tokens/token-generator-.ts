export interface TokenGenerator {
    sign(payload: { sub: string }): Promise<string>
}