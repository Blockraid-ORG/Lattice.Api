import { EnumVerificationStatus } from '@prisma/client';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateProjectVerificationDto {
  @IsEnum(EnumVerificationStatus)
  status: EnumVerificationStatus;

  @IsOptional()
  @IsString()
  note?: string;

  @IsUUID()
  projectId: string;
}
