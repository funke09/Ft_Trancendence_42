-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "usernam" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "avatarUrl" TEXT NOT NULL,
    "oAuthId" TEXT NOT NULL,
    "userStatus" TEXT NOT NULL DEFAULT 'Offline',
    "socketId" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_usernam_key" ON "User"("usernam");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_oAuthId_key" ON "User"("oAuthId");
