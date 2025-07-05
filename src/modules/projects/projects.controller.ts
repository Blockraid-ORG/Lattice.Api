import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUserId } from 'src/common/decorators/current-user.decorator';
import { QueryParamDto } from 'src/common/pagination/dto/pagination.dto';
import {
  CreateProjectDto,
  CreateReviewProjectDto,
} from './dto/create-project-dto';
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
  // Extra
  @Post('reject')
  @HttpCode(HttpStatus.OK)
  async reject(@Body() dto: CreateReviewProjectDto) {
    return this.projectsService.reject(dto);
  }
  @Post('approve')
  @HttpCode(HttpStatus.OK)
  async approve(@Body() dto: CreateReviewProjectDto) {
    return this.projectsService.approve(dto);
  }
}
