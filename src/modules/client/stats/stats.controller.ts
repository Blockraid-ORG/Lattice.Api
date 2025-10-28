import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserSession } from 'src/auth/dto/auth.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { StatsService } from './stats.service';

@UseGuards(AuthGuard('jwt'))
@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}
  @Get('count-asset')
  countAsset(@CurrentUser() user: UserSession) {
    return this.statsService.countAsset(user);
  }
  @Get('list-asset')
  listAsset(@CurrentUser() user: UserSession) {
    return this.statsService.listAsset(user);
  }
}
