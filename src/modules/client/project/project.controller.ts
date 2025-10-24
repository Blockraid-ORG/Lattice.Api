import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ProjectService } from './project.service';
import { QueryParamDto } from 'src/common/pagination/dto/pagination.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { AuthGuard } from '@nestjs/passport';

@Controller('client/project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('my-vesting')
  findMyVesting(@Query() query: QueryParamDto, @CurrentUser() user) {
    return this.projectService.findMyVesting(query, user);
  }

  @Get()
  findMany(@Query() query: QueryParamDto) {
    return this.projectService.findMany(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectService.findOne(id);
  }
}
