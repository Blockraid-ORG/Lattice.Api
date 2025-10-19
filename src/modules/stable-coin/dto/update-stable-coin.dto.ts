import { PartialType } from '@nestjs/mapped-types';
import { CreateStableCoinDto } from './create-stable-coin.dto';

export class UpdateStableCoinDto extends PartialType(CreateStableCoinDto) {}
