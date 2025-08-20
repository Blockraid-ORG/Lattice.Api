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
  CreatePresaleDto,
  FindMyContributeDto,
} from './dto/create-presale.dto';
import { PresalesService } from './presales.service';
import { CurrentUserId } from 'src/common/decorators/current-user.decorator';
import { AuthGuard } from '@nestjs/passport';

@Controller('presales')
export class PresalesController {
  constructor(private readonly presalesService: PresalesService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(
    @Body() createPresaleDto: CreatePresaleDto,
    @CurrentUserId() userId: string,
  ) {
    return this.presalesService.create(createPresaleDto, userId);
  }

  @Get()
  findAll(@Query() query: QueryParamDto) {
    return this.presalesService.findAll(query);
  }
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  findAllMyPresale(
    @Query() query: QueryParamDto,
    @CurrentUserId() userId: string,
  ) {
    return this.presalesService.findAllMyPresale(query, userId);
  }

  @Get('active')
  findAllActivePresale(@Query() query: QueryParamDto) {
    return this.presalesService.findAllActivePresale(query);
  }
  @Get('upcoming')
  findAllUpcomingPresale(@Query() query: QueryParamDto) {
    return this.presalesService.findAllUpcomingPresale(query);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('my-contribution')
  getMyContribution(
    @Query() query: FindMyContributeDto,
    @CurrentUserId() userId: string,
  ) {
    return this.presalesService.getMyContribution(query, userId);
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.presalesService.findOne(id);
  }
}
