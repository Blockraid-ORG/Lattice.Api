import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUserId } from 'src/common/decorators/current-user.decorator';
import { FindSummaryProjectDto } from './dto/usr-client.dto';
import { UsrClientService } from './usr-client.service';

@UseGuards(AuthGuard('jwt'))
@Controller('usr-client')
export class UsrClientController {
  constructor(private readonly usrClientService: UsrClientService) {}
  @Get('count-project')
  countSummaryProject(
    @Query() query: FindSummaryProjectDto,
    @CurrentUserId() userId,
  ) {
    return this.usrClientService.countSummaryProject(query, userId);
  }
}
