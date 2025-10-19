import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApproveMemberVerificationDto,
  CreateMemberVerificationDto,
  RejectMemberVerificationDto,
} from './dto/create-member-verification.dto';
import { UpdateMemberVerificationDto } from './dto/update-member-verification.dto';
import { MemberVerificationsService } from './member-verifications.service';
import { AuthGuard } from '@nestjs/passport';
import { PermissionGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard('jwt'))
@Controller('member-verifications')
export class MemberVerificationsController {
  constructor(
    private readonly memberVerificationsService: MemberVerificationsService,
  ) {}

  @Post()
  create(@Body() dto: CreateMemberVerificationDto) {
    return this.memberVerificationsService.create(dto);
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.memberVerificationsService.findByUser(userId);
  }

  @HttpCode(HttpStatus.OK)
  @Post('revision')
  update(@Body() dto: UpdateMemberVerificationDto) {
    return this.memberVerificationsService.revision(dto);
  }
  @UseGuards(AuthGuard('jwt'), PermissionGuard)
  @HttpCode(HttpStatus.OK)
  @Post('reject')
  reject(@Body() dto: RejectMemberVerificationDto) {
    return this.memberVerificationsService.reject(dto);
  }
  @UseGuards(AuthGuard('jwt'), PermissionGuard)
  @HttpCode(HttpStatus.OK)
  @Post('approve')
  approve(@Body() dto: ApproveMemberVerificationDto) {
    return this.memberVerificationsService.approve(dto);
  }
  @Post('approve-by-zkme')
  approveByWalletAddress(@Body() data: { walletAddress: string }) {
    return this.memberVerificationsService.approveByWalletAddress(data);
  }
}
