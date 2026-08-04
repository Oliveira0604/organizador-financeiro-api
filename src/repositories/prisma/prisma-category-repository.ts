
import type { Prisma } from "@/generated/prisma/client";
import type { CategoryRepository, CreateCategoryData } from "../category-repository";
import { prisma } from "@/lib/prisma";

export class PrismaCategoryRepository implements CategoryRepository {
    async create(data: CreateCategoryData) {
        const category = await prisma.category.create({
            data: {
                name: data.name,

                user: {
                    connect: {
                        id: data.userId
                    }
                }
            }
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

    async findByName(userId: string, name: string) {
        const category = await prisma.category.findUnique({
            where: {
                userId_name: {
                    userId,
                    name
                }
            }
        });

        return category;
    }

    async update(id: string, data: Prisma.CategoryUpdateInput) {
        const category = await prisma.category.update({
            where: {
                id
            },
            data
        });

        return category;

    }

    async delete(id: string) {
        await prisma.category.delete({
            where: {
                id,
            }
        });
    }
}