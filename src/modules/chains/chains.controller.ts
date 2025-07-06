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
import { ChainsService } from './chains.service';
import { CreateChainDto } from './dto/create-chain.dto';
import { UpdateChainDto } from './dto/update-chain.dto';
import { PermissionGuard } from 'src/auth/auth.guard';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'), PermissionGuard)
@Controller('chains')
export class ChainsController {
  constructor(private readonly chainsService: ChainsService) {}

  @Post()
  create(@Body() createChainDto: CreateChainDto) {
    return this.chainsService.create(createChainDto);
  }
  @Get()
  findMany(@Query() query: QueryParamDto) {
    return this.chainsService.findMany(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chainsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChainDto: UpdateChainDto) {
    return this.chainsService.update(id, updateChainDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chainsService.remove(id);
  }
}
