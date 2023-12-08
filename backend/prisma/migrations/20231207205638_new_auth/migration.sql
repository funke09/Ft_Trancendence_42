/*
  Warnings:

  - Added the required column `hash` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isAuth` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "hash" TEXT NOT NULL,
ADD COLUMN     "isAuth" BOOLEAN NOT NULL;
