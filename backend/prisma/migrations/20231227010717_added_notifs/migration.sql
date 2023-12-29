-- CreateTable
CREATE TABLE "Notifs" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "msg" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,
    "avatar" TEXT NOT NULL DEFAULT 'http://localhost:3000/images/jesus.webp',
    "friendId" INTEGER NOT NULL,

    CONSTRAINT "Notifs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Notifs" ADD CONSTRAINT "Notifs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
