import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ProjectTypesService } from './project-types.service';
import { CreateProjectTypeDto } from './dto/create-project-type.dto';
import { UpdateProjectTypeDto } from './dto/update-project-type.dto';
import { QueryParamDto } from 'src/common/pagination/dto/pagination.dto';

@Controller('project-types')
export class ProjectTypesController {
  constructor(private readonly projectTypesService: ProjectTypesService) {}

  @Post()
  create(@Body() dto: CreateProjectTypeDto) {
    return this.projectTypesService.create(dto);
  }

  @Get()
  findMany(@Query() query: QueryParamDto) {
    return this.projectTypesService.findMany(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectTypesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProjectTypeDto) {
    return this.projectTypesService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectTypesService.remove(id);
  }
}
