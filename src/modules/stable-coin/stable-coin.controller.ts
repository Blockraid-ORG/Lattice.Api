import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { QueryParamDto } from 'src/common/pagination/dto/pagination.dto';
import { CreateStableCoinDto } from './dto/create-stable-coin.dto';
import { UpdateStableCoinDto } from './dto/update-stable-coin.dto';
import { StableCoinService } from './stable-coin.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('stable-coin')
export class StableCoinController {
  constructor(private readonly stableCoinService: StableCoinService) {}
  @Get('used')
  getStableUsed(@Query() query: QueryParamDto) {
    return this.stableCoinService.getStableUsed(query);
  }
  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() dto: CreateStableCoinDto) {
    return this.stableCoinService.create(dto);
  }

  @Get()
  findAll(@Query() query: QueryParamDto) {
    return this.stableCoinService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stableCoinService.findOne(id);
  }
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateStableCoinDto: UpdateStableCoinDto,
  ) {
    return this.stableCoinService.update(id, updateStableCoinDto);
  }
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.stableCoinService.remove(id);
  }
}
