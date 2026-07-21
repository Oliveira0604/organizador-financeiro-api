import type { Prisma } from "@/generated/prisma/client";
import type { UserRepository } from "../user-repository";
import { prisma } from "@/lib/prisma";

export class PrismaUserRepository implements UserRepository {
    async create(data: Prisma.UserCreateInput) {
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

    async findByEmail(email: string) {
        const user = await prisma.user.findUnique({
            where: {
                email,
            }
        });

        return user;
    }

}