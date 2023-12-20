import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { OutcomeDto } from "./dto/outcome.dto";
import { AchievDto } from "./dto/achiev.dto";

const ACHIEV: { [key: string]: AchievDto } = {
	"hot-shot": {
		name: 'Hot Shot',
		desc: 'Swift and decisive victory!',
		icon: '/stats/hot-shot.jpg',
	},

	"hat-trick": {
		name: 'Hat-Trick Hero',
		desc: 'Be 3 scores ahead of Opponent',
		icon: '/stats/hat-trick.jpg',
	},

	"close-call": {
		name: 'Close Call',
		desc: 'Victory in a nail-biting match!',
		icon: '/stats/close-call.jpg',
	},

	"ace": {
		name: 'Ace',
		desc: 'First game in Hardcore mode!',
		icon: '/stats/ace.jpg',
	},

	"conqueror": {
		name: 'Conqueror',
		desc: 'First game in Medium mode!',
		icon: '/stats/conqueror.jpg',
	},

	"rookie": {
		name: 'Rookie',
		desc: 'Congrats on your first game',
		icon: '/stats/rookie.jpg',
	},

	"elite": {
		name: 'Elite',
		desc: 'Attaining elite status after winning 10 games!',
		icon: '/stats/elite.jpg',
	},

	"bronze": {
		name: 'Bronze',
		desc: '',
		icon: '',
	},

	"silver": {
		name: 'Silver',
		desc: '',
		icon: '',
	},

	"gold": {
		name: 'Gold',
		desc: '',
		icon: '',
	},

	"platinum": {
		name: 'Platinum',
		desc: '',
		icon: '',
	},

	"diamond": {
		name: 'Diamond',
		desc: '',
		icon: '',
	},
}

@Injectable()
export class GameData {
	private readonly prisma = new PrismaService();
	constructor() {}

	async getUserByUsername(username: string): Promise<{
		id: number;
		userStats: {
			id: number;
			achievements: AchievDto[];
			wins: number;
			losses: number;
			rank: string;
		}
	}> {
		return (await this.prisma.user.findUnique({
			where: {
				username: username,
			},
			select: {
				id: true,
				userStats: {
					select: {
						id: true,
						achievements: true,
						wins: true,
						losses: true,
						rank: true,
					},
				}
			},
		}));
	}

	async handleAchiev(res: OutcomeDto) {
		const stats = await (await this.getUserByUsername(res.winner)).userStats;

		if (res.score.winner === 5 && res.score.loser === 0)
			await this.saveAcheiv(res.winner, res.wClient, 'hot-shot');
		
		if (res.score.winner - res.score.loser >= 3)
			await this.saveAcheiv(res.winner, res.wClient, 'hat-trick');

		if (res.score.winner - res.score.loser === 1)
			await this.saveAcheiv(res.winner, res.wClient, 'close-call');

		if (res.mode === 'Hardcore')
			await this.saveAcheiv(res.winner, res.wClient, 'ace')

		if (res.mode === 'Medium')
			await this.saveAcheiv(res.winner, res.wClient, 'conqueror')

		if (stats.wins + stats.losses === 0) {
			await this.saveAcheiv(res.winner, res.wClient, 'rookie')
			await this.saveAcheiv(res.loser, res.lClient, 'rookie')
		}

		if (stats.wins + stats.losses === 10)
			await this.saveAcheiv(res.winner, res.wClient, 'elite')

		try {
			const id = (await this.getUserByUsername(res.winner)).id;

			if (stats.wins === 3) {
				await this.prisma.stats.update({
					where: { userId: id },
					data: { rank: 'Bronze' },
				});
				res.wClient && res.wClient.emit('achievement', ACHIEV['bronze']);
			}

			if (stats.wins === 5) {
				await this.prisma.stats.update({
					where: { userId: id },
					data: { rank: 'Silver' },
				});
				res.wClient && res.wClient.emit('achievement', ACHIEV['silver']);
			}

			
			if (stats.wins === 10) {
				await this.prisma.stats.update({
					where: { userId: id },
					data: { rank: 'Gold' },
				});
				res.wClient && res.wClient.emit('achievement', ACHIEV['gold']);
			}

			
			if (stats.wins === 20) {
				await this.prisma.stats.update({
					where: { userId: id },
					data: { rank: 'Platinum' },
				});
				res.wClient && res.wClient.emit('achievement', ACHIEV['platinum']);
			}

			
			if (stats.wins === 35) {
				await this.prisma.stats.update({
					where: { userId: id },
					data: { rank: 'Diamond' },
				});
				res.wClient && res.wClient.emit('achievement', ACHIEV['diamond']);
			}
		} catch (error) {
			console.error("Error: Updating rank");
		}
	};

	async saveAcheiv(username: string, client: any, achiev: string) {
		if (!ACHIEV[achiev]) return;

		const stats = (await this.getUserByUsername(username)).userStats;
		const userAchiev = stats.achievements;

		if (userAchiev.find((a) => a.name === ACHIEV[achiev].name)) return;
		
		await this.prisma.achievements.create({
			data: {
				name: ACHIEV[achiev].name,
				desc: ACHIEV[achiev].desc,
				icon: ACHIEV[achiev].icon,
				user: {
					connect: {
						id: stats.id,
					},
				},
			},
		});
		client && client.emit('achievement', ACHIEV[achiev]);
	};

	async createStats(username: string) {
		const id = (await this.getUserByUsername(username)).id;
		await this.prisma.stats.create({
			data: {
				rank: "Unranked",
				user: {
					connect: { id: id },
				},
			},
		});
	};

	async saveGame(res: OutcomeDto) {
		try {
			const wUser = await this.getUserByUsername(res.winner);
			const lUser = await this.getUserByUsername(res.loser);

			if (wUser.userStats === null) this.createStats(res.winner);
			if (lUser.userStats === null) this.createStats(res.loser);

			await this.handleAchiev(res);

			await this.prisma.game.create({
				data: {
					outcome: "WIN",
					p1Score: res.score.winner,
					p2Score: res.score.loser,
					gameType: res.mode,
					p2Id: lUser.id,
					user: {
						connect: {
							id: wUser.id,
						},
					},
				},
			});

			await this.prisma.game.create({
				data: {
					outcome: 'LOSE',
					p1Score: res.score.loser,
					p2Score: res.score.winner,
					gameType: res.mode,
					p2Id: wUser.id,
					user: {
						connect: {
							id: lUser.id,
						},
					},
				},
			});

			await this.prisma.stats.update({
				where: { userId: wUser.id },
				data: { wins: {increment: 1}},
			});

			await this.prisma.stats.update({
				where: { userId: lUser.id },
				data: { losses: {increment: 1}},
			});
		} catch (error) {}
	};
};