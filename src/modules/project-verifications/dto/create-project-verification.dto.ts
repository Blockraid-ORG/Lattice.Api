import { EnumProjectStatus } from '@prisma/client';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateProjectVerificationDto {
  @IsEnum(EnumProjectStatus)
  status: EnumProjectStatus;

  @IsOptional()
  @IsString()
  note?: string;

  @IsOptional()
  @IsString()
  contractAddress?: string;

  @IsUUID()
  projectId: string;
}
