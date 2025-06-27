import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUserId } from 'src/common/decorators/current-user.decorator';
import { QueryParamDto } from 'src/common/pagination/dto/pagination.dto';
import { CreateProjectDto } from './dto/create-project-dto';
import { ProjectsService } from './projects.service';

@UseGuards(AuthGuard('jwt'))
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  async create(@Body() dto: CreateProjectDto, @CurrentUserId() userId: string) {
    return this.projectsService.create(dto, userId);
  }
  @Get()
  findMany(@Query() query: QueryParamDto) {
    return this.projectsService.findMany(query);
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }
}
