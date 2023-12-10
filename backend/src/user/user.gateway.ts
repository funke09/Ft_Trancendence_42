import { JwtService } from "@nestjs/jwt";
import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Namespace, Socket } from "socket.io";
import { UserService } from "./user.service";
import { Status, User } from "@prisma/client";
import { UnauthorizedException } from "@nestjs/common";
import { JwtPayloadDto } from "src/auth/dto/auth.dto";

@WebSocketGateway({ namespace: 'user' })
export class UserGateway implements OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer()
	io: Namespace;

	constructor (private jwtService: JwtService, private userService: UserService) {}

	private connectedUsers = new Map<number, string>();

	async handleConnection(client: Socket) {
		let user: User;
		let token = client.handshake.headers.cookie;
		if (token)
			token = token.split('=')[1];

		try
		{
			const authToken = token
			if (!authToken)
				throw new UnauthorizedException();
			const decodedToken = await this.jwtService.decode(authToken);
			user = await this.userService.findOne(decodedToken.id);
			if (!user)
				throw new UnauthorizedException();
			if (this.connectedUsers.has(user.id))
			{
				this.io.to(client.id).emit('alreadyConnected', user.id);
				const socketId = this.connectedUsers.get(user.id);
				if (socketId) {
					const socket = this.io.sockets.get(socketId);
					socket.disconnect();
				}
			}
		} catch(error) {
			console.error("error => ", error);
			client.disconnect();
			return ;
		}
		this.connectedUsers.set(user.id, client.id);
	}

	async handleDisconnect(client: Socket) {
		const jwtService = this.jwtService;
		const cookie = client.handshake.headers?.cookie;
		if (!cookie) {
			client.disconnect();
			return ;
		}
		const token = cookie.split('=')[1];
		const decoded: JwtPayloadDto = jwtService.decode(token) as JwtPayloadDto;
		const user: User = await this.userService.findOne(decoded.id);
		if (user.userStatus === Status.ONLINE || user.userStatus === Status.INGAME) {
			const updateUser = await this.userService.update(user.id, {
				userStatus: Status.OFFLINE
			});
		}
		await this.userService.deletePendingGame(user.id);
		this.removeSocketId(client.id);
		client.disconnect();
	}

	getSocketId(userId: number) {
		return this.connectedUsers.get(userId);
	}

	removeSocketId(clientId: string) {
		for (const [userId, socketId] of this.connectedUsers.entries()) {
			if (socketId === clientId) {
				this.connectedUsers.delete(userId);
			}
		}
	}
}