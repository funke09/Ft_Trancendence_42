/*
  Warnings:

  - You are about to drop the column `oAuth_code` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `oAuth_exp` on the `users` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "users_oAuth_code_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "oAuth_code",
DROP COLUMN "oAuth_exp";
