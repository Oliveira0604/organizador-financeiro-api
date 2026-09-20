export interface HashGenerator {
    hash(password: string): Promise<string>
}