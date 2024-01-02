/*
  Warnings:

  - You are about to drop the column `player1Id` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `player1Score` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `player2Id` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `player2Score` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `winner` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `gameStatus` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `p2Id` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Game` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Game" DROP CONSTRAINT "Game_player1Id_fkey";

-- DropForeignKey
ALTER TABLE "Game" DROP CONSTRAINT "Game_player2Id_fkey";

-- DropForeignKey
ALTER TABLE "Stats" DROP CONSTRAINT "Stats_userId_fkey";

-- AlterTable
ALTER TABLE "Game" DROP COLUMN "player1Id",
DROP COLUMN "player1Score",
DROP COLUMN "player2Id",
DROP COLUMN "player2Score",
DROP COLUMN "status",
DROP COLUMN "winner",
ADD COLUMN     "gameStatus" "GameStatus" NOT NULL,
ADD COLUMN     "outcome" TEXT DEFAULT 'Undefined',
ADD COLUMN     "p1Score" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "p2Id" INTEGER NOT NULL,
ADD COLUMN     "p2Score" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL,
ALTER COLUMN "gameType" DROP DEFAULT;

-- DropTable
DROP TABLE "users";

-- DropEnum
DROP TYPE "Status";

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "avatar" TEXT,
    "userStatus" TEXT NOT NULL DEFAULT 'Offline',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "Stats" ADD CONSTRAINT "Stats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
