import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PermissionGuard } from 'src/auth/auth.guard';
import { QueryParamDto } from 'src/common/pagination/dto/pagination.dto';
import {
  CreateMemberByAdminDto,
  SignCategoryDto,
  SignTypeDto,
} from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { MembersService } from './members.service';

@Controller('members')
@UseGuards(AuthGuard('jwt'), PermissionGuard)
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Post()
  create(@Body() createUserDto: CreateMemberByAdminDto) {
    return this.membersService.create(createUserDto);
  }

  @Get()
  findMany(@Query() query: QueryParamDto) {
    return this.membersService.findMany(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.membersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateMemberDto) {
    return this.membersService.update(id, updateUserDto);
  }
  @HttpCode(HttpStatus.OK)
  @Post('sign-category')
  signCategory(@Body() dto: SignCategoryDto) {
    return this.membersService.signCategory(dto);
  }
  @HttpCode(HttpStatus.OK)
  @Post('sign-type')
  signType(@Body() dto: SignTypeDto) {
    return this.membersService.signType(dto);
  }
}
