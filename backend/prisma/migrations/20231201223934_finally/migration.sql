/*
  Warnings:

  - You are about to drop the column `banner` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `fortytwoId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `intraId` on the `User` table. All the data in the column will be lost.
  - Added the required column `hash` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isAuthenticated` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "User_fortytwoId_key";

-- DropIndex
DROP INDEX "User_intraId_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "banner",
DROP COLUMN "fortytwoId",
DROP COLUMN "intraId",
ADD COLUMN     "hash" TEXT NOT NULL,
ADD COLUMN     "isAuthenticated" BOOLEAN NOT NULL;
