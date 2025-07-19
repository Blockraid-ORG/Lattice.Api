import { Module } from '@nestjs/common';
import { MemberVerificationsService } from './member-verifications.service';
import { MemberVerificationsController } from './member-verifications.controller';

@Module({
  controllers: [MemberVerificationsController],
  providers: [MemberVerificationsService],
})
export class MemberVerificationsModule {}
