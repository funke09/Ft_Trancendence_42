-- CreateTable
CREATE TABLE "ChannelUserMute" (
    "id" SERIAL NOT NULL,
    "channelId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "muteExpiry" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChannelUserMute_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ChannelUserMute_channelId_userId_key" ON "ChannelUserMute"("channelId", "userId");

-- AddForeignKey
ALTER TABLE "ChannelUserMute" ADD CONSTRAINT "ChannelUserMute_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChannelUserMute" ADD CONSTRAINT "ChannelUserMute_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
