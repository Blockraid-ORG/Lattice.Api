import { Module } from '@nestjs/common';
import { ClientAppsService } from './client-apps.service';
import { ClientAppsController } from './client-apps.controller';

@Module({
  controllers: [ClientAppsController],
  providers: [ClientAppsService],
})
export class ClientAppsModule {}
