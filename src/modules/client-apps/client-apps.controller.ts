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
import { ClientAppsService } from './client-apps.service';
import { CreateClientAppDto } from './dto/create-client-app.dto';
import { UpdateClientAppDto } from './dto/update-client-app.dto';
import { QueryParamDto } from 'src/common/pagination/dto/pagination.dto';
import { AuthGuard } from '@nestjs/passport';
import { PermissionGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard('jwt'), PermissionGuard)
@Controller('client-apps')
export class ClientAppsController {
  constructor(private readonly clientAppsService: ClientAppsService) {}

  @Post()
  create(@Body() createClientAppDto: CreateClientAppDto) {
    return this.clientAppsService.create(createClientAppDto);
  }

  @Get()
  findMany(@Query() query: QueryParamDto) {
    return this.clientAppsService.findMany(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clientAppsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateClientAppDto: UpdateClientAppDto,
  ) {
    return this.clientAppsService.update(id, updateClientAppDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clientAppsService.remove(id);
  }
}
