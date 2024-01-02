-- AlterTable
ALTER TABLE "Stats" ALTER COLUMN "rank" DROP NOT NULL,
ALTER COLUMN "rank" SET DEFAULT 'Unranked';

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "userStatus" DROP DEFAULT;
