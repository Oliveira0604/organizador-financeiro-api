import type { User } from "@/generated/prisma/client";

export type CreateUserData = {
    name: string,
    phoneNumber: string,
    deletedAt?: Date
}

export type UpdateUserData = {
    name?: string,
    phoneNumber?: string,
}

export interface UserRepository {
    create(data: CreateUserData): Promise<User>
    findById(id: string): Promise<User | null>
    findByPhoneNumber(email: string): Promise<User | null>
    update(id: string, data: UpdateUserData): Promise<User>
    delete(id: string): Promise<void>
}