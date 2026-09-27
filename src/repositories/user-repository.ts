export type CreateUserData = {
    name: string,
    phoneNumber: string,
    passwordHash?: string | null
}

export type UpdateUserData = {
    name?: string,
    phoneNumber?: string,
    passwordHash?: string
}

export type User = {
    id: string,
    name: string,
    phoneNumber: string,
    passwordHash: string | null,
    createdAt: Date,
    updatedAt: Date | null,
    deletedAt: Date | null
}

export interface UserRepository {
    create(data: CreateUserData): Promise<User>
    findById(id: string): Promise<User | null>
    findByPhoneNumber(phoneNumber: string): Promise<User | null>
    update(id: string, data: UpdateUserData): Promise<User | null>
    updatePassword(id: string, passwordHash: string): Promise<User | null>
    delete(id: string): Promise<void>
}