/*
  Warnings:

  - The primary key for the `Stats` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `matchesPlayed` on the `Stats` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Stats` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Stats" DROP CONSTRAINT "Stats_pkey",
DROP COLUMN "matchesPlayed",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Stats_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "Achievements" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Achievements_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Stats_userId_key" ON "Stats"("userId");

-- AddForeignKey
ALTER TABLE "Achievements" ADD CONSTRAINT "Achievements_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Stats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
