import { EnumProjectStatus } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class FindSummaryProjectDto {
  @IsString()
  @IsOptional()
  @IsEnum(EnumProjectStatus)
  type: EnumProjectStatus;
}
