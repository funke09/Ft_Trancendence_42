/*
  Warnings:

  - You are about to drop the column `isAuth` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "isAuth",
DROP COLUMN "name",
DROP COLUMN "updatedAt";
