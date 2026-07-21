
import type { Prisma } from "@/generated/prisma/client";
import type { CategoryRepository } from "../category-repository";
import { prisma } from "@/lib/prisma";

export class PrismaCategoryRepository implements CategoryRepository {
    async create(data: Prisma.CategoryCreateInput) {
        const category = await prisma.category.create({
            data,
        });

        return category;
    }

    async findById(id: string) {
        const category = await prisma.category.findUnique({
            where: {
                id,
            }
        });

        return category;
    }

    async update(userId: string, id: string, data: Prisma.CategoryUpdateInput) {
        const category = await prisma.category.update({
            where: {
                userId,
                id
            },
            data
        });

        return category;

    }

    async delete(userId: string, id: string) {
        await prisma.category.delete({
            where: {
                userId,
                id,
            }
        });
    }
}