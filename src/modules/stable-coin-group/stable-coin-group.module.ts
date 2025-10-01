import { Module } from '@nestjs/common';
import { StableCoinGroupService } from './stable-coin-group.service';
import { StableCoinGroupController } from './stable-coin-group.controller';

@Module({
  controllers: [StableCoinGroupController],
  providers: [StableCoinGroupService],
})
export class StableCoinGroupModule {}
