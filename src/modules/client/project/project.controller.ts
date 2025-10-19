import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProjectService } from './project.service';
import { QueryParamDto } from 'src/common/pagination/dto/pagination.dto';

@Controller('client/project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  findMany(@Query() query: QueryParamDto) {
    return this.projectService.findMany(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectService.findOne(id);
  }
}
