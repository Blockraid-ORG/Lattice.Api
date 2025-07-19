import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateMemberVerificationDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsOptional()
  idCard?: string;

  @IsString()
  @IsOptional()
  selfie?: string;

  @IsString()
  @IsOptional()
  bisnisLicense?: string;

  @IsString()
  @IsOptional()
  taxId?: string;
}

export class RejectMemberVerificationDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  rejectionReason?: string;
}
export class ApproveMemberVerificationDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;
}
