import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { QueryParamDto } from 'src/common/pagination/dto/pagination.dto';
import { CreateProjectVerificationDto } from './dto/create-project-verification.dto';
import { ProjectVerificationsService } from './project-verifications.service';
import { AuthGuard } from '@nestjs/passport';
import { PermissionGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard('jwt'), PermissionGuard)
@Controller('project-verifications')
export class ProjectVerificationsController {
  constructor(
    private readonly projectVerificationsService: ProjectVerificationsService,
  ) {}

  @Post()
  create(@Body() createProjectVerificationDto: CreateProjectVerificationDto) {
    return this.projectVerificationsService.create(
      createProjectVerificationDto,
    );
  }

  @Get()
  findMany(@Query() query: QueryParamDto) {
    return this.projectVerificationsService.findMany(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectVerificationsService.findOne(id);
  }
}
