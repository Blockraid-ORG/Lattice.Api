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
import {
  AddWhitelistDto,
  CreatePresaleDto,
  CreateTransactionPresaleDto,
} from './dto/create-presale.dto';
import { PresaleService } from './presale.service';
import { CurrentUserId } from 'src/common/decorators/current-user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { FindMyContributeDto } from './dto/find-presale.dto';

@Controller('presale')
export class PresaleController {
  constructor(private readonly presaleService: PresaleService) {}
  @Get('active')
  findActivePresale(@Query() query: QueryParamDto) {
    return this.presaleService.findActivePresale(query);
  }
  @UseGuards(AuthGuard('jwt'))
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
  @UseGuards(AuthGuard('jwt'))
  @Post('whitelist')
  addWhitelist(@Body() dto: AddWhitelistDto) {
    return this.presaleService.addWhitelist(dto);
  }
  @UseGuards(AuthGuard('jwt'))
  @Post('create-contribute-presale')
  createContributePresale(
    @Body() dto: CreateTransactionPresaleDto,
    @CurrentUserId() userId: string,
  ) {
    return this.presaleService.createContributePresale(dto, userId);
  }
  @UseGuards(AuthGuard('jwt'))
  @Get('my-contribution')
  getMyContribution(
    @Query() query: FindMyContributeDto,
    @CurrentUserId() userId: string,
  ) {
    return this.presaleService.getMyContribution(query, userId);
  }
}
