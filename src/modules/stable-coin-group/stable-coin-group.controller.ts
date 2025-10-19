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
import { StableCoinGroupService } from './stable-coin-group.service';
import { CreateStableCoinGroupDto } from './dto/create-stable-coin-group.dto';
import { UpdateStableCoinGroupDto } from './dto/update-stable-coin-group.dto';
import { QueryParamDto } from 'src/common/pagination/dto/pagination.dto';

@Controller('stable-coin-group')
export class StableCoinGroupController {
  constructor(
    private readonly stableCoinGroupService: StableCoinGroupService,
  ) {}

  @Post()
  create(@Body() dto: CreateStableCoinGroupDto) {
    return this.stableCoinGroupService.create(dto);
  }

  @Get()
  findAll(@Query() query: QueryParamDto) {
    return this.stableCoinGroupService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stableCoinGroupService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateStableCoinGroupDto) {
    return this.stableCoinGroupService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.stableCoinGroupService.remove(id);
  }
}
