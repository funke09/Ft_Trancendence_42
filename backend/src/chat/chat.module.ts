import { AuthModule } from "src/auth/auth.module";
import { ChatGateway } from "./chat.gateway";
import { ChatService } from "./chat.service";
import { PrismaService } from "src/prisma/prisma.service";
import { JwtUnauthFilter } from "src/exceptions/ws.exception.catch";
import { ChannelService } from "./channel.service";
import { ChatHistory } from "./chat.history";
import { Module } from "@nestjs/common";

@Module({
	imports: [AuthModule],
	providers: [
		ChatGateway,
		ChatService,
		PrismaService,
		JwtUnauthFilter,
		ChannelService,
		ChatHistory,
	],
})
export class ChatModule {}