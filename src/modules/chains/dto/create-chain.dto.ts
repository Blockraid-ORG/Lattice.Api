import { ChianType } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateChainDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  ticker: string;

  @IsNotEmpty()
  @IsEnum(ChianType)
  type: ChianType;

  @IsString()
  logo: string;

  @IsOptional()
  @IsString()
  icon?: string;
}
