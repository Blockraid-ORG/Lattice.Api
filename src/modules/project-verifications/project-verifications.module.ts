import { Module } from '@nestjs/common';
import { ProjectVerificationsService } from './project-verifications.service';
import { ProjectVerificationsController } from './project-verifications.controller';

@Module({
  controllers: [ProjectVerificationsController],
  providers: [ProjectVerificationsService],
})
export class ProjectVerificationsModule {}
