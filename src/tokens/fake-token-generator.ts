import type { TokenGenerator } from "./token-generator-";

export class FakeTokenGenerator implements TokenGenerator {
    async signAccessToken(payload: { sub: string; }) {
        return `fake-token-${payload.sub}`;
    }

    async signRefreshToken(payload: { sub: string; }) {
        return `fake-refresh-token-${payload.sub}`;
    }
}