/*
  Warnings:

  - Added the required column `password_hash` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "password_hash" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "expenses_userId_paidAt_idx" ON "expenses"("userId", "paidAt");

-- CreateIndex
CREATE INDEX "expenses_userId_categoryId_idx" ON "expenses"("userId", "categoryId");

-- CreateIndex
CREATE INDEX "expenses_categoryId_idx" ON "expenses"("categoryId");

-- CreateIndex
CREATE INDEX "incomes_userId_receivedAt_idx" ON "incomes"("userId", "receivedAt");

-- CreateIndex
CREATE INDEX "incomes_userId_categoryId_idx" ON "incomes"("userId", "categoryId");

-- CreateIndex
CREATE INDEX "incomes_categoryId_idx" ON "incomes"("categoryId");
