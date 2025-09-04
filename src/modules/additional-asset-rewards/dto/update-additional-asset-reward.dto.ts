import { PartialType } from '@nestjs/mapped-types';
import { CreateAdditionalAssetRewardDto } from './create-additional-asset-reward.dto';

export class UpdateAdditionalAssetRewardDto extends PartialType(CreateAdditionalAssetRewardDto) {}
