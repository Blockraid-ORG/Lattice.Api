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

  @IsOptional()
  @IsString()
  factoryAddress?: string;

  @IsOptional()
  @IsString()
  presaleAddress?: string;

  @IsOptional()
  @IsString()
  whitelistsAddress?: string;

  @IsUUID()
  projectId: string;
}
