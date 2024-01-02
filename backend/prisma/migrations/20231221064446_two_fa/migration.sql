/*
  Warnings:

  - A unique constraint covering the columns `[otpTwoFA]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isTwoFA" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "otpTwoFA" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_otpTwoFA_key" ON "User"("otpTwoFA");
