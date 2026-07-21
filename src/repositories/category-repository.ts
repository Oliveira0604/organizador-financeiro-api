import type { Category, Prisma } from "@/generated/prisma/client";

export interface CategoryRepository {
    create(data: Prisma.CategoryCreateInput): Promise<Category>
    findById(id: string): Promise<Category | null>
    update(userId: string, id: string, data: Prisma.CategoryUpdateInput): Promise<Category>
    delete(userId: string, id: string): Promise<void>
}