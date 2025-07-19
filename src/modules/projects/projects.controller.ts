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
import { PermissionGuard } from 'src/auth/auth.guard';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get('upcoming')
  findUpcomingProject(@Query() query: QueryParamDto) {
    return this.projectsService.findMany({
      ...query,
      status: 'PENDING',
    });
  }
  @UseGuards(AuthGuard('jwt'), PermissionGuard)
  @Post()
  async create(@Body() dto: CreateProjectDto, @CurrentUserId() userId: string) {
    return this.projectsService.create(dto, userId);
  }
  @UseGuards(AuthGuard('jwt'), PermissionGuard)
  @Get()
  @UseGuards(AuthGuard('jwt'), PermissionGuard)
  @Get()
  findMany(@Query() query: QueryParamDto) {
    return this.projectsService.findMany(query);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  findMyProject(
    @Query() query: QueryParamDto,
    @CurrentUserId() userId: string,
  ) {
    return this.projectsService.findMany({
      ...query,
      userId,
    });
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'), PermissionGuard)
  @Post('reject')
  @HttpCode(HttpStatus.OK)
  async reject(@Body() dto: CreateReviewProjectDto) {
    return this.projectsService.reject(dto);
  }
  @UseGuards(AuthGuard('jwt'), PermissionGuard)
  @Post('approve')
  @HttpCode(HttpStatus.OK)
  async approve(@Body() dto: CreateReviewProjectDto) {
    return this.projectsService.approve(dto);
  }
}
