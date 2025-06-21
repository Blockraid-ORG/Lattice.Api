import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { VerificationsService } from './verifications.service';
import { CreateMasterVerificationDto } from './dto/create-master-verification.dto';
import { UpdateMasterVerificationDto } from './dto/update-master-verification.dto';
import { QueryParamDto } from 'src/common/pagination/dto/pagination.dto';
import { PermissionGuard } from 'src/auth/auth.guard';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'), PermissionGuard)
@Controller('master/verifications')
export class VerificationsController {
  constructor(
    private readonly masterVerificationsService: VerificationsService,
  ) {}

  @Post()
  create(@Body() createChainDto: CreateMasterVerificationDto) {
    return this.masterVerificationsService.create(createChainDto);
  }
  @Get()
  findMany(@Query() query: QueryParamDto) {
    return this.masterVerificationsService.findMany(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.masterVerificationsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateChainDto: UpdateMasterVerificationDto,
  ) {
    return this.masterVerificationsService.update(id, updateChainDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.masterVerificationsService.remove(id);
  }
}
