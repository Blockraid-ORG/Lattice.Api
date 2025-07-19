import { EnumUserCategory, EnumUserType } from '@prisma/client';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { IsStrongPassword } from 'src/common/validators/IsStrongPassword';
export class JwtPayload {
  userId: string;
}
export class CreateMemberDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  fullname: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @IsEmail()
  email: string;

  @IsStrongPassword({
    minLength: 6,
  })
  password: string;

  @IsBoolean()
  @IsOptional()
  status?: boolean;
}
export class CreateMemberByAdminDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  fullname: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  email: string;
}
export class SignCategoryDto {
  @IsUUID()
  userId: string;
  @IsEnum(EnumUserCategory)
  category: EnumUserCategory;
}
export class SignTypeDto {
  @IsUUID()
  userId: string;
  @IsEnum(EnumUserType)
  type: EnumUserType;
}
