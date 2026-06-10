import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUserId } from 'src/common/decorators/current-user.decorator';
import { AccountService } from './account.service';
import { BindAcccountDto } from './dto/create-user.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}
  @Get('me')
  async getMyAccount(
    @CurrentUserId() userId: string,
    @Headers('x-app-code') appCode: string,
  ) {
    return this.accountService.getMyAccount(userId, appCode);
  }
  @Post('bind')
  async bindAccount(
    @Body() dto: BindAcccountDto,
    @CurrentUserId() userId: string,
    @Headers('x-app-code') appCode: string,
  ) {
    return this.accountService.bindAccount(dto, userId, appCode);
  }
}
