import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUserId } from 'src/common/decorators/current-user.decorator';
import { FindSummaryProjectDto } from './dto/usr-client.dto';
import { UsrClientService } from './usr-client.service';
import { QueryParamDto } from 'src/common/pagination/dto/pagination.dto';

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

  @Get('verified-user')
  findUserVerified(@Query() query: QueryParamDto) {
    return this.usrClientService.findUserVerified(query);
  }
}
