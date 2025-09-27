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
import { AddressPoolPaymentsService } from './address-pool-payments.service';
import { CreateAddressPoolPaymentDto } from './dto/create-address-pool-payment.dto';
import { UpdateAddressPoolPaymentDto } from './dto/update-address-pool-payment.dto';
import { QueryParamDto } from 'src/common/pagination/dto/pagination.dto';
import { AuthGuard } from '@nestjs/passport';
import { PermissionGuard } from 'src/auth/auth.guard';

@Controller('address-pool-payments')
export class AddressPoolPaymentsController {
  constructor(
    private readonly addressPoolPaymentsService: AddressPoolPaymentsService,
  ) {}
  @UseGuards(AuthGuard('jwt'), PermissionGuard)
  @Post()
  create(@Body() dto: CreateAddressPoolPaymentDto) {
    return this.addressPoolPaymentsService.create(dto);
  }

  @Get()
  findAll(@Query() query: QueryParamDto) {
    return this.addressPoolPaymentsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.addressPoolPaymentsService.findOne(id);
  }
  @UseGuards(AuthGuard('jwt'), PermissionGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateAddressPoolPaymentDto) {
    return this.addressPoolPaymentsService.update(id, dto);
  }
  @UseGuards(AuthGuard('jwt'), PermissionGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.addressPoolPaymentsService.remove(id);
  }
}
