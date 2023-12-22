import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { OutcomeDto } from "./dto/outcome.dto";
import { AchievDto } from "./dto/achiev.dto";
import { RankDto } from "./dto/rank.dto";

const RANKS: { [key: string]: RankDto } = {
	"Bronze": {
		name: 'Bronze',
	},
	"Silver": {
		name: 'Silver',
	},
	"Gold": {
		name: 'Gold',
	},
	"Platinum": {
		name: 'Platinum',
	},
	"Diamond": {
		name: 'Diamond',
	},
}

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
		desc: 'Win a game in Hardcore mode!',
		icon: '/stats/ace.jpg',
	},

	"conqueror": {
		name: 'Conqueror',
		desc: 'Win a game in Medium mode!',
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

}

@Injectable()
export class GameData {
  private readonly prisma = new PrismaService();

  constructor() {}

  private async getUserStatsByUsername(username: string) {
    return (await this.prisma.user.findUnique({
      where: { username },
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
        },
      },
    })).userStats;
  }

  private async updateUserRank(userId: number, rank: string, client?: any) {
    await this.prisma.stats.update({
      where: { userId },
      data: { rank },
    });
    client && client.emit('rank', RANKS[rank]);
  }

  private async saveAchievement(username: string, client: any, achiev: string) {
    if (!ACHIEV[achiev]) return;

    const stats = (await this.getUserStatsByUsername(username));
    const userAchiev = stats.achievements;

    if (userAchiev.find((a) => a.name === ACHIEV[achiev].name)) return;

    await this.prisma.achievements.create({
      data: {
        name: ACHIEV[achiev].name,
        desc: ACHIEV[achiev].desc,
        icon: ACHIEV[achiev].icon,
        user: {
          connect: { id: stats.id },
        },
      },
    });

    client && client.emit('achievement', ACHIEV[achiev]);
  }

  private async handleAchievements(res: OutcomeDto) {
    const wStats = await this.getUserStatsByUsername(res.winner);
    const lStats = await this.getUserStatsByUsername(res.loser);

    if (res.score.winner === 5 && res.score.loser === 0) {
      await this.saveAchievement(res.winner, res.wClient, 'hot-shot');
    }

    if (res.score.winner - res.score.loser >= 3) {
      await this.saveAchievement(res.winner, res.wClient, 'hat-trick');
    }

    if (res.score.winner - res.score.loser === 1) {
      await this.saveAchievement(res.winner, res.wClient, 'close-call');
    }

    if (res.mode === 'Hardcore') {
      await this.saveAchievement(res.winner, res.wClient, 'ace');
    }

    if (res.mode === 'Medium') {
      await this.saveAchievement(res.winner, res.wClient, 'conqueror');
    }

    if (wStats.wins + wStats.losses === 0 || lStats.wins + lStats.losses === 0) {
      await this.saveAchievement(res.winner, res.wClient, 'rookie');
	  await this.saveAchievement(res.loser, res.lClient, 'rookie');
    }
  }

  private async createStatsIfNull(userId: number) {
    const userStats = await this.getUserStatsById(userId);
    if (!userStats) {
      await this.createStats(userId);
    }
  }

  private async getUserStatsById(userId: number) {
    return this.prisma.stats.findUnique({
      where: { userId },
    });
  }

  private async getUserByUsername(username: string) {
    return this.prisma.user.findUnique({
      where: { username },
    });
  }

  private async createStats(userId: number) {
    await this.prisma.stats.create({
      data: {
        rank: "Unranked",
        user: {
          connect: { id: userId },
        },
      },
    });
  }

  async handleRankUpdates(userId: number, wins: number) {
	const rankThresholds = [3, 5, 10, 20, 30];
	const ranks = ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'];
  
	for (let i = 0; i < rankThresholds.length; i++) {
	  if (wins === rankThresholds[i]) {
		await this.updateUserRank(userId, ranks[i]);
		break;
	  }
	}
  }
  
  async saveGame(res: OutcomeDto) {
	try {
	  const wUser = await this.getUserByUsername(res.winner);
	  const lUser = await this.getUserByUsername(res.loser);
	  const wStats = await this.getUserStatsByUsername(res.winner);
  
	  await this.createStatsIfNull(wUser.id);
	  await this.createStatsIfNull(lUser.id);
  
	  await this.handleAchievements(res);
  
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
		data: { wins: { increment: 1 } },
	  });
  
	  await this.prisma.stats.update({
		where: { userId: lUser.id },
		data: { losses: { increment: 1 } },
	  });
  
	  await this.handleRankUpdates(wUser.id, wStats.wins);
  
	} catch (error) {
	  console.error("Error:", error);
	}
  }
}