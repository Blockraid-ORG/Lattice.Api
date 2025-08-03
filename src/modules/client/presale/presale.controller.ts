import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PresaleService } from './presale.service';
import { AddWhitelistDto, CreatePresaleDto } from './dto/create-presale.dto';
import { UpdatePresaleDto } from './dto/update-presale.dto';

@Controller('presale')
export class PresaleController {
  constructor(private readonly presaleService: PresaleService) {}

  @Post()
  create(@Body() createPresaleDto: CreatePresaleDto) {
    return this.presaleService.create(createPresaleDto);
  }

  @Get()
  findAll() {
    return this.presaleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.presaleService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePresaleDto: UpdatePresaleDto) {
    return this.presaleService.update(+id, updatePresaleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.presaleService.remove(+id);
  }

  // Extra
  @Post('whitelist')
  addWhitelist(@Body() dto: AddWhitelistDto) {
    return this.presaleService.addWhitelist(dto);
  }
}
