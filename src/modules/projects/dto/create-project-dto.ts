import { EnumProjectStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  ValidateNested,
} from 'class-validator';

export class CreateProjectAllocationDto {
  @IsString()
  @MaxLength(128)
  name: string;

  @IsInt()
  supply: number;

  @IsInt()
  vesting: number;

  @IsDateString()
  startDate: string;

  @IsBoolean()
  isPresale: boolean;
}

export class CreateProjectSocialDto {
  @IsUUID()
  socialId: string;

  @IsString()
  @MaxLength(255)
  url: string;
}

export class CreatePresalesDto {
  @IsUUID()
  chainId: string;

  @IsNumberString()
  hardcap: string;

  @IsNumberString()
  price: string;

  @IsNumberString()
  maxContribution: string;

  @IsDateString()
  duration: string;

  @IsString()
  @MaxLength(64)
  unit: string;
}

export class CreateProjectDto {
  @IsString()
  @MaxLength(128)
  name: string;

  @IsString()
  @MaxLength(128)
  slug: string;

  @IsString()
  logo: string;

  @IsOptional()
  @IsString()
  banner?: string;

  @IsOptional()
  @IsString()
  ticker?: string;

  @IsNumber()
  decimals: number;

  @IsString() // Decimal as string
  totalSupply: string;

  @IsString()
  detail: string;

  @IsEnum(EnumProjectStatus)
  status: EnumProjectStatus;

  // @IsOptional()
  // @IsUUID()
  // userId?: string;

  @IsUUID()
  categoryId: string;

  @IsOptional()
  @IsString()
  createdBy?: string;

  // Chains (ProjectChain)
  @IsArray()
  @IsUUID('all', { each: true })
  chainIds: string[];

  // Allocations
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProjectAllocationDto)
  allocations: CreateProjectAllocationDto[];

  // ProjectSocial
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProjectSocialDto)
  socials: CreateProjectSocialDto[];

  // Presales (One-to-one)
  @IsOptional()
  @ValidateNested()
  @Type(() => CreatePresalesDto)
  presales?: CreatePresalesDto;
}
