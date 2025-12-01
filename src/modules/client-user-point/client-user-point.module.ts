import { Module } from '@nestjs/common';
import { ClientUserPointService } from './client-user-point.service';
import { ClientUserPointController } from './client-user-point.controller';

@Module({
  controllers: [ClientUserPointController],
  providers: [ClientUserPointService],
})
export class ClientUserPointModule {}
