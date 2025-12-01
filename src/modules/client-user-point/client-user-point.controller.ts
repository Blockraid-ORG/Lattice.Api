import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUserId } from 'src/common/decorators/current-user.decorator';
import { ClientUserPointService } from './client-user-point.service';
import { OperationUserPointDto } from './dto/create-client-user-point.dto';
import { PermissionGuard } from 'src/auth/auth.guard';
import { QueryParamDto } from 'src/common/pagination/dto/pagination.dto';

@Controller('client-user-point')
export class ClientUserPointController {
  constructor(private readonly service: ClientUserPointService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('get-my-point')
  getMyPoint(@CurrentUserId() userId: string) {
    return this.service.getMyPoint(userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('get-my-history-point')
  getMyHistoryPoint(
    @Query() query: QueryParamDto,
    @CurrentUserId() userId: string,
  ) {
    return this.service.getMyHistoryPoint(query, userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('add-point')
  addPoint(
    @Body() dto: OperationUserPointDto,
    @CurrentUserId() userId: string,
  ) {
    return this.service.addPoint(dto, userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('claim-point')
  claimPoint(
    @Body() dto: OperationUserPointDto,
    @CurrentUserId() userId: string,
  ) {
    return this.service.claimPoint(dto, userId);
  }

  @UseGuards(AuthGuard('jwt'), PermissionGuard)
  @Post('decrease-point')
  decreasePoint(
    @Body() dto: OperationUserPointDto,
    @CurrentUserId() userId: string,
  ) {
    return this.service.decreasePoint(dto, userId);
  }

  @UseGuards(AuthGuard('jwt'), PermissionGuard)
  @Post('increase-point')
  increasePoint(
    @Body() dto: OperationUserPointDto,
    @CurrentUserId() userId: string,
  ) {
    return this.service.increasePoint(dto, userId);
  }
}
