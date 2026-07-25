import type { Category } from "@/generated/prisma/client";

export type CreateCategoryData = {
    name: string,
    userId: string,
    createdAt: Date,
    updatedAt: Date
}

export type UpdateCategoryData = {
    name: string,
}

export interface CategoryRepository {
    create(data: CreateCategoryData): Promise<Category>
    findById(id: string): Promise<Category | null>
    update(id: string, data: UpdateCategoryData): Promise<Category | null>
    delete(id: string): Promise<void>
}