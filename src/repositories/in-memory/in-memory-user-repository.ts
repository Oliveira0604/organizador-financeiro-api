import { randomUUID } from "node:crypto";
import type { CreateUserData, UpdateUserData, UserRepository } from "../user-repository";
import type { User } from "@/generated/prisma/client";

export class InMemoryUserRepository implements UserRepository {
    public items: User[] = [];

    async create(data: CreateUserData) {
        const user = {
            id: randomUUID(),
            name: data.name,
            phoneNumber: data.phoneNumber,
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null
        };

        this.items.push(user);

        return user;
    }

    async findById(id: string) {
        const user = this.items.find((item) => item.id === id);

        if (!user) {
            throw new ResourceNotFoundError();
        }

        return user;
    }

    async findByPhoneNumber(phoneNumber: string) {
        const user = this.items.find((item) => item.phoneNumber === phoneNumber);

        if (!user) {
            throw new ResourceNotFoundError();
        }

        return user;
    }

    async update(id: string, data: UpdateUserData) {
        const user = this.items.find((item) => item.id === id);

        if (!user) {
            throw new ResourceNotFoundError();
        }

        Object.assign(user, data);

        return user;
    }

    async delete(id: string) {
        const userIndex = this.items.findIndex((item) => item.id === id);

        if (!userIndex) {
            throw new ResourceNotFoundError();
        }

        this.items.splice(userIndex, 1);
    }
}