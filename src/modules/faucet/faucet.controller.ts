import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUserId } from 'src/common/decorators/current-user.decorator';
import { QueryParamDto } from 'src/common/pagination/dto/pagination.dto';
import { CreateFaucetDto } from './dto/create-faucet.dto';
import { FaucetService } from './faucet.service';

@Controller('faucet')
@UseGuards(AuthGuard('jwt'))
export class FaucetController {
  constructor(private readonly faucetService: FaucetService) {}

  @Post()
  create(@Body() dto: CreateFaucetDto, @CurrentUserId() userId: string) {
    return this.faucetService.create(dto, userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  findMany(@Query() query: QueryParamDto) {
    return this.faucetService.findMany(query);
  }
}
