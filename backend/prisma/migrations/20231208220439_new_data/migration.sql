/*
  Warnings:

  - You are about to drop the column `blockedIds` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `confirmed` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `hash` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `is2FA` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `isBanned` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `oAuthId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `socketId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `twoFaSecret` on the `User` table. All the data in the column will be lost.
  - The `userStatus` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `Friends` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Matches` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserStats` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[oAuth_code]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ONLINE', 'OFFLINE', 'INGAME');

-- CreateEnum
CREATE TYPE "GameStatus" AS ENUM ('MATCHMAKING', 'INVITE', 'ONGOING', 'FINISHED');

-- CreateEnum
CREATE TYPE "GameType" AS ENUM ('CLASSIC', 'MEDIUM', 'HARDCORE');

-- DropForeignKey
ALTER TABLE "Friends" DROP CONSTRAINT "Friends_friendId_fkey";

-- DropForeignKey
ALTER TABLE "Friends" DROP CONSTRAINT "Friends_userId_fkey";

-- DropForeignKey
ALTER TABLE "Matches" DROP CONSTRAINT "Matches_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserStats" DROP CONSTRAINT "UserStats_userId_fkey";

-- DropIndex
DROP INDEX "User_oAuthId_key";

-- DropIndex
DROP INDEX "User_twoFaSecret_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "blockedIds",
DROP COLUMN "confirmed",
DROP COLUMN "hash",
DROP COLUMN "is2FA",
DROP COLUMN "isBanned",
DROP COLUMN "oAuthId",
DROP COLUMN "socketId",
DROP COLUMN "twoFaSecret",
ADD COLUMN     "oAuth_code" TEXT,
ADD COLUMN     "oAuth_exp" TIMESTAMP(3),
ADD COLUMN     "password" TEXT NOT NULL,
DROP COLUMN "userStatus",
ADD COLUMN     "userStatus" "Status" NOT NULL DEFAULT 'OFFLINE';

-- DropTable
DROP TABLE "Friends";

-- DropTable
DROP TABLE "Matches";

-- DropTable
DROP TABLE "UserStats";

-- CreateTable
CREATE TABLE "Stats" (
    "userId" INTEGER NOT NULL,
    "matchesPlayed" INTEGER NOT NULL DEFAULT 0,
    "wins" INTEGER NOT NULL DEFAULT 0,
    "losses" INTEGER NOT NULL DEFAULT 0,
    "rank" TEXT NOT NULL DEFAULT 'Iron',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Stats_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Game" (
    "id" SERIAL NOT NULL,
    "player1Id" INTEGER,
    "player1Score" INTEGER NOT NULL DEFAULT 0,
    "player2Id" INTEGER,
    "player2Score" INTEGER NOT NULL DEFAULT 0,
    "winner" INTEGER,
    "status" "GameStatus" NOT NULL,
    "gameType" "GameType" NOT NULL DEFAULT 'CLASSIC',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_oAuth_code_key" ON "User"("oAuth_code");

-- AddForeignKey
ALTER TABLE "Stats" ADD CONSTRAINT "Stats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_player1Id_fkey" FOREIGN KEY ("player1Id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_player2Id_fkey" FOREIGN KEY ("player2Id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
