import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAdditionalRewardTypeDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsBoolean()
  status?: boolean;
}
