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
import { CreateSocialDto } from './dto/create-social.dto';
import { UpdateSocialDto } from './dto/update-social.dto';
import { SocialsService } from './socials.service';
import { AuthGuard } from '@nestjs/passport';
import { PermissionGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard('jwt'), PermissionGuard)
@Controller('socials')
export class SocialsController {
  constructor(private readonly socialsService: SocialsService) {}
  @Post()
  create(@Body() createChainDto: CreateSocialDto) {
    return this.socialsService.create(createChainDto);
  }
  @Get()
  findMany(@Query() query: QueryParamDto) {
    return this.socialsService.findMany(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.socialsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: UpdateSocialDto) {
    return this.socialsService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.socialsService.remove(id);
  }
}
