import { Module } from '@nestjs/common';
import { AdditionalAssetRewardsService } from './additional-asset-rewards.service';
import { AdditionalAssetRewardsController } from './additional-asset-rewards.controller';

@Module({
  controllers: [AdditionalAssetRewardsController],
  providers: [AdditionalAssetRewardsService],
})
export class AdditionalAssetRewardsModule {}
