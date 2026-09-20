import type { HashComparer } from "./hash-comparer";
import type { HashGenerator } from "./hash-generator";

export class FakeHasher implements HashComparer, HashGenerator {
    async hash(password: string) {
        return `${password}-hashed`;
    }

    async compare(password: string, passwordHashed: string) {
        return `${password}-hashed` === passwordHashed;
    }
}