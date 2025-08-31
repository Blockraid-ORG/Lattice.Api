import { PartialType } from '@nestjs/mapped-types';
import { CreateAdditionalRewardTypeDto } from './create-additional-reward-type.dto';

export class UpdateAdditionalRewardTypeDto extends PartialType(CreateAdditionalRewardTypeDto) {}
