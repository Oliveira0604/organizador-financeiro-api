import type { CreateUserData, UpdateUserData, UserRepository } from "../user-repository";
import { prisma } from "@/lib/prisma";

export class PrismaUserRepository implements UserRepository {
    async create(data: CreateUserData) {
        const user = await prisma.user.create({
            data,
        });

        return user;
    }

    async findById(id: string) {
        const user = await prisma.user.findUnique({
            where: {
                id,
            }
        });

        return user;
    }

    async findByPhoneNumber(phoneNumber: string) {
        const user = await prisma.user.findUnique({
            where: {
                phoneNumber,
            }
        });

        return user;
    }

    async update(id: string, data: UpdateUserData) {
        const user = await prisma.user.update({
            where: {
                id,
            },
            data
        });

        return user;
    }

    async delete(id: string) {
        await prisma.user.update({
            where: {
                id,
            },
            data: {
                deletedAt: new Date()
            }
        });
    }
}