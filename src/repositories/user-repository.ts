export type CreateUserData = {
    name: string,
    email: string,
    passwordHash: string
}

export type UpdateUserData = {
    name?: string,
    email?: string,
    passwordHash?: string
}

export type User = {
    id: string,
    name: string,
    email: string,
    passwordHash: string | null,
    createdAt: Date,
    updatedAt: Date | null,
    deletedAt: Date | null
}

export interface UserRepository {
    create(data: CreateUserData): Promise<User>
    findById(id: string): Promise<User | null>
    findByEmail(email: string): Promise<User | null>
    update(id: string, data: UpdateUserData): Promise<User | null>
    updatePassword(id: string, passwordHash: string): Promise<User | null>
    delete(id: string): Promise<void>
}