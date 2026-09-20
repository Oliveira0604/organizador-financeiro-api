import type { TokenGenerator } from "./token-generator-";

export class FakeTokenGenerator implements TokenGenerator {
    async sign(payload: { sub: string; }) {
        return `fake-token-${payload.sub}`;
    }
}