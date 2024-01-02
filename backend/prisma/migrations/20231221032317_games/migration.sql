/*
  Warnings:

  - You are about to drop the `Game` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Game" DROP CONSTRAINT "Game_userId_fkey";

-- DropTable
DROP TABLE "Game";

-- CreateTable
CREATE TABLE "Games" (
    "id" SERIAL NOT NULL,
    "outcome" TEXT DEFAULT 'Undefined',
    "p1Score" INTEGER NOT NULL DEFAULT 0,
    "p2Score" INTEGER NOT NULL DEFAULT 0,
    "p2Id" INTEGER NOT NULL,
    "gameType" TEXT DEFAULT 'Undefined',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Games_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Games" ADD CONSTRAINT "Games_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
