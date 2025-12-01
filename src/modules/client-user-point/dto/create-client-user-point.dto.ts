import { EnumPointHistoryType } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreatePointHoistory {
  @IsNotEmpty()
  @IsString()
  pointId: string;

  @IsNotEmpty()
  @IsNumber()
  change: number;

  @IsOptional()
  @IsString()
  description?: string;
}

export class OperationUserPointDto {
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsOptional()
  @IsEnum(EnumPointHistoryType)
  type?: EnumPointHistoryType;
}
