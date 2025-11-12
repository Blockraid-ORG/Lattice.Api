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
import {
  AddProjectAddressWhitelistDto,
  CreateNewPresaleDto,
  CreatePresaleDto,
  FindMyContributeDto,
} from './dto/create-presale.dto';
import { PresalesService } from './presales.service';
import { CurrentUserId } from 'src/common/decorators/current-user.decorator';
import { AuthGuard } from '@nestjs/passport';
import {
  CreateClaimPresaleDto,
  GetClaimPresaleDto,
} from '../client/presale/dto/create-presale.dto';
import { UpdateNewPresaleDto } from './dto/update-presale.dto';

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
  @Get('end-presale')
  findAllEndPresale(@Query() query: QueryParamDto) {
    return this.presalesService.findAllEndPresale(query);
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

  @UseGuards(AuthGuard('jwt'))
  @Post('claimPresale')
  createClaimPresale(
    @Body() dto: CreateClaimPresaleDto,
    @CurrentUserId() userId: string,
  ) {
    return this.presalesService.createClaimPresale(dto, userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('claimPresale')
  getMyClaimPresale(
    @Query() dto: GetClaimPresaleDto,
    @CurrentUserId() userId: string,
  ) {
    return this.presalesService.getMyClaimPresale(dto, userId);
  }

  // Manage Presale
  @UseGuards(AuthGuard('jwt'))
  @Post('create-new-presale')
  createNewPresale(@Body() dto: CreateNewPresaleDto) {
    return this.presalesService.createNewPresale(dto);
  }
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  deletePresale(@Param('id') id: string) {
    return this.presalesService.deletePresale(id);
  }
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  updatePresale(@Param('id') id: string, @Body() dto: UpdateNewPresaleDto) {
    return this.presalesService.updatePresale(id, dto);
  }
  // Manage Presale Whitelist
  @UseGuards(AuthGuard('jwt'))
  @Post('add-project-presale-whitelist-address')
  addProjectPresaleWhitelistAddress(
    @Body() dto: AddProjectAddressWhitelistDto[],
  ) {
    return this.presalesService.addProjectPresaleWhitelistAddress(dto);
  }
  @UseGuards(AuthGuard('jwt'))
  @Post('remove-project-presale-whitelist-address')
  removeProjectPresaleWhitelistAddress(@Body() dto: string[]) {
    return this.presalesService.removeProjectPresaleWhitelistAddress(dto);
  }
  @UseGuards(AuthGuard('jwt'))
  @Post('setWdPresale')
  setWdPresale(@Body('id') id: string) {
    return this.presalesService.setWdPresale(id);
  }
  // Manage Presale
}
