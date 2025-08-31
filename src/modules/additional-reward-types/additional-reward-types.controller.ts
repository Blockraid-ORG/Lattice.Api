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
import { AdditionalRewardTypesService } from './additional-reward-types.service';
import { CreateAdditionalRewardTypeDto } from './dto/create-additional-reward-type.dto';
import { UpdateAdditionalRewardTypeDto } from './dto/update-additional-reward-type.dto';
import { QueryParamDto } from 'src/common/pagination/dto/pagination.dto';

@Controller('additional-reward-types')
export class AdditionalRewardTypesController {
  constructor(private readonly service: AdditionalRewardTypesService) {}

  @Post()
  create(@Body() dto: CreateAdditionalRewardTypeDto) {
    return this.service.create(dto);
  }

  @Get()
  findMany(@Query() query: QueryParamDto) {
    return this.service.findMany(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateAdditionalRewardTypeDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
