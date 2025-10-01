import { PartialType } from '@nestjs/mapped-types';
import { CreateStableCoinGroupDto } from './create-stable-coin-group.dto';

export class UpdateStableCoinGroupDto extends PartialType(CreateStableCoinGroupDto) {}
