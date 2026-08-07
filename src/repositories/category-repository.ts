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
    createdAt: Date
    updatedAt: Date | null
    userId: string
}

export interface CategoryRepository {
    create(data: CreateCategoryData): Promise<Category>
    findById(id: string): Promise<Category | null>
    findByName(userId: string, name: string): Promise<Category | null>
    update(id: string, data: UpdateCategoryData): Promise<Category | null>
    delete(id: string): Promise<void>
}