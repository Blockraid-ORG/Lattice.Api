import { Module } from '@nestjs/common';
import { AdditionalRewardTypesService } from './additional-reward-types.service';
import { AdditionalRewardTypesController } from './additional-reward-types.controller';

@Module({
  controllers: [AdditionalRewardTypesController],
  providers: [AdditionalRewardTypesService],
})
export class AdditionalRewardTypesModule {}
