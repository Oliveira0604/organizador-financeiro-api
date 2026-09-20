import bcrypt from "bcryptjs";
import type { HashComparer } from "./hash-comparer";
import type { HashGenerator } from "./hash-generator";

export class BcryptHasher implements HashGenerator, HashComparer {
    async hash(password: string) {
        return bcrypt.hash(password, 8);
    }

    async compare(password: string, hashedPassword: string) {
        return bcrypt.compare(password, hashedPassword);
    }
}