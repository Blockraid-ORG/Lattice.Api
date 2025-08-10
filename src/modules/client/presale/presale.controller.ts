import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { QueryParamDto } from 'src/common/pagination/dto/pagination.dto';
import { AddWhitelistDto, CreatePresaleDto } from './dto/create-presale.dto';
import { PresaleService } from './presale.service';

@Controller('presale')
export class PresaleController {
  constructor(private readonly presaleService: PresaleService) {}

  @Post()
  create(@Body() createPresaleDto: CreatePresaleDto) {
    return this.presaleService.create(createPresaleDto);
  }

  @Get()
  findMany(@Query() query: QueryParamDto) {
    return this.presaleService.findMany(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.presaleService.findOne(id);
  }
  // Extra
  @Post('whitelist')
  addWhitelist(@Body() dto: AddWhitelistDto) {
    return this.presaleService.addWhitelist(dto);
  }
}
