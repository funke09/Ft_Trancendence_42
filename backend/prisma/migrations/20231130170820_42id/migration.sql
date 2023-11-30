/*
  Warnings:

  - A unique constraint covering the columns `[fortytwoId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fortytwoId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "fortytwoId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_fortytwoId_key" ON "User"("fortytwoId");
