import { IsString, MaxLength } from 'class-validator';

export class CreateStableCoinGroupDto {
  @IsString()
  @MaxLength(8)
  name: string;
}
