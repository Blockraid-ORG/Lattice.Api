import { EnumUserCategory } from '@prisma/client';
import { IsBoolean, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateMasterVerificationDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEnum(EnumUserCategory)
  type: EnumUserCategory;

  @IsNotEmpty()
  @IsBoolean()
  IDCardRequired: boolean;

  @IsNotEmpty()
  @IsBoolean()
  SelfieRequired: boolean;

  @IsNotEmpty()
  @IsBoolean()
  BussinessLicenseRequired: boolean;

  @IsNotEmpty()
  @IsBoolean()
  TaxIdRequired: boolean;
}
