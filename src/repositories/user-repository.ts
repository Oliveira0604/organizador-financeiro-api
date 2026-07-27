export type CreateUserData = {
    name: string,
    phoneNumber: string,
    deletedAt?: Date
}

export type UpdateUserData = {
    name?: string,
    phoneNumber?: string,
}

export type User = {
    id: string,
    name: string,
    phoneNumber: string,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: null
}

export interface UserRepository {
    create(data: CreateUserData): Promise<User>
    findById(id: string): Promise<User | null>
    findByPhoneNumber(email: string): Promise<User | null>
    update(id: string, data: UpdateUserData): Promise<User | null>
    delete(id: string): Promise<void>
}