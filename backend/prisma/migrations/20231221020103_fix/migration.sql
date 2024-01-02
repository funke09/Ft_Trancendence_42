/*
  Warnings:

  - Made the column `rank` on table `Stats` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Stats" ALTER COLUMN "rank" SET NOT NULL,
ALTER COLUMN "rank" DROP DEFAULT;
