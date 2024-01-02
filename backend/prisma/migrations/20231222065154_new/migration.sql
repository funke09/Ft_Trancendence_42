/*
  Warnings:

  - You are about to drop the `Games` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Games" DROP CONSTRAINT "Games_userId_fkey";

-- DropTable
DROP TABLE "Games";

-- CreateTable
CREATE TABLE "Game" (
    "id" SERIAL NOT NULL,
    "outcome" TEXT DEFAULT 'Undefined',
    "p1Score" INTEGER NOT NULL DEFAULT 0,
    "p2Score" INTEGER NOT NULL DEFAULT 0,
    "p2Id" INTEGER NOT NULL,
    "gameType" TEXT DEFAULT 'Undefined',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
