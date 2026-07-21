/*
  Warnings:

  - You are about to drop the column `user_id` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `category_id` on the `expenses` table. All the data in the column will be lost.
  - You are about to drop the column `paid_at` on the `expenses` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `expenses` table. All the data in the column will be lost.
  - You are about to drop the column `category_id` on the `incomes` table. All the data in the column will be lost.
  - You are about to drop the column `received_at` on the `incomes` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `incomes` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `password_hash` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,name]` on the table `categories` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `categories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `categoryId` to the `expenses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `expenses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `categoryId` to the `incomes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `incomes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `passwordHash` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "categories" DROP CONSTRAINT "categories_user_id_fkey";

-- DropForeignKey
ALTER TABLE "expenses" DROP CONSTRAINT "expenses_category_id_fkey";

-- DropForeignKey
ALTER TABLE "expenses" DROP CONSTRAINT "expenses_user_id_fkey";

-- DropForeignKey
ALTER TABLE "incomes" DROP CONSTRAINT "incomes_category_id_fkey";

-- DropForeignKey
ALTER TABLE "incomes" DROP CONSTRAINT "incomes_user_id_fkey";

-- DropIndex
DROP INDEX "categories_user_id_name_key";

-- AlterTable
ALTER TABLE "categories" DROP COLUMN "user_id",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "expenses" DROP COLUMN "category_id",
DROP COLUMN "paid_at",
DROP COLUMN "user_id",
ADD COLUMN     "categoryId" TEXT NOT NULL,
ADD COLUMN     "paidAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "incomes" DROP COLUMN "category_id",
DROP COLUMN "received_at",
DROP COLUMN "user_id",
ADD COLUMN     "categoryId" TEXT NOT NULL,
ADD COLUMN     "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "created_at",
DROP COLUMN "password_hash",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "passwordHash" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "categories_userId_name_key" ON "categories"("userId", "name");

-- AddForeignKey
ALTER TABLE "incomes" ADD CONSTRAINT "incomes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "incomes" ADD CONSTRAINT "incomes_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
