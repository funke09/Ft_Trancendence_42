import { Controller, Get } from '@nestjs/common';
import { scores } from './mockData';

@Controller('scores')
export class ScoreController {
  @Get()
  getAllScores() {
    return scores;
  }
}