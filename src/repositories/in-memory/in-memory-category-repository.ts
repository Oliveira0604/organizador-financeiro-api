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
            throw new ResourceNotFoundError();
        }

        return category;
    }

    async update(userId: string, id: string, data: UpdateCategoryData) {
        const category = this.items.find((item) => item.id === id);

        if (!category) {
            throw new ResourceNotFoundError();
        }

        if (category.userId !== userId) {
            throw new NotAllowedError();
        }

        Object.assign(category, data);

        return category;
    }

    async delete(userId: string, id: string) {
        const categoryIndex = this.items.findIndex((item) => item.id === id);

        if (categoryIndex === -1) {
            throw new ResourceNotFoundError();
        }

        if (this.items[categoryIndex]!.userId !== userId) {
            throw new NotAllowedError();
        }

        this.items.splice(categoryIndex, 1);
    }
}