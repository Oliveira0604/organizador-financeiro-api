export type CreateCategoryData = {
    name: string,
    userId: string,
}

export type UpdateCategoryData = {
    name: string,
}

export type Category = {
    id: string,
    name: string,
    userId: string
    createdAt: Date | null
    updatedAt: Date | null
    deletedAt: Date | null
}

export interface CategoryRepository {
    create(data: CreateCategoryData): Promise<Category>
    findById(id: string): Promise<Category | null>
    findByName(userId: string, name: string): Promise<Category | null>
    update(id: string, data: UpdateCategoryData): Promise<Category | null>
    delete(id: string): Promise<void>
}