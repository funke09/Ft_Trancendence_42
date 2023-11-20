import { Module } from '@nestjs/common';
import { GameGateway } from './modules/game/game.gateway';
import { GameService } from './modules/game/game.service';

@Module({
  imports: [],
  controllers: [],
  providers: [GameGateway, GameService],
})
export class AppModule {}
