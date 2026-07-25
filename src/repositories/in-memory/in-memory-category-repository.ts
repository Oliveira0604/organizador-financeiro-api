import type { Category } from "@/generated/prisma/client";
import type { CategoryRepository, CreateCategoryData, UpdateCategoryData } from "../category-repository";
import { randomUUID } from "node:crypto";

export class InMemoryCategoryRepository implements CategoryRepository {
    public items: Category[] = [];

    async create(data: CreateCategoryData) {
        const category = {
            id: randomUUID(),
            name: data.name,
            userId: data.userId,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt
        };

        this.items.push(category);

        return category;
    }

    async findById(id: string) {
        const category = this.items.find((item) => item.id === id);

        if (!category) {
            return null;
        }

        return category;
    }

    async update(id: string, data: UpdateCategoryData) {
        const category = this.items.find((item) => item.id === id);

        if (!category) {
            return null;
        }

        Object.assign(category, data);

        return category;
    }

    async delete(id: string) {
        const categoryIndex = this.items.findIndex((item) => item.id === id);

        this.items.splice(categoryIndex, 1);
    }
}