import { PartialType } from '@nestjs/mapped-types';
import { EnumProjectStatus, PaymentHistoryType } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
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

  @IsNumber()
  duration: number;

  @IsOptional()
  @IsNumber()
  claimTime: number;

  @IsOptional()
  @IsString()
  startDate: string;

  @IsOptional()
  @IsString()
  endDate: string;

  @IsString()
  @MaxLength(64)
  unit: string;
}

export class CreateAdditionalRewardDto {
  @IsString()
  address: string;
  @IsString()
  amount: string;
  @IsUUID()
  typeId: string;
  @IsUUID()
  userId: string;
  @IsString()
  startDateCliam: string;
  @IsString()
  endDateCliam: string;
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

  @IsUUID()
  categoryId: string;

  @IsUUID()
  projectTypeId: string;

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

  @IsOptional()
  @ValidateNested()
  @Type(() => CreatePresalesDto)
  presales?: CreatePresalesDto;

  @IsArray()
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateAdditionalRewardDto)
  additionalReward?: CreateAdditionalRewardDto[];
}
export class CreateReviewProjectDto {
  @IsString()
  @MaxLength(128)
  projectId: string;

  @IsEnum(EnumProjectStatus)
  status: EnumProjectStatus;

  @IsString()
  @IsOptional()
  note: string;
}

export class UpdateAllocationDto {
  @IsString()
  @MaxLength(128)
  id: string;

  @IsString()
  contractAddress: string;
}
export class SetAllocationDeployingDto {
  @IsString()
  @MaxLength(128)
  id: string;
}
export class SetContractWhitelistDto {
  @IsString()
  @MaxLength(128)
  id: string;

  @IsString()
  @MaxLength(128)
  whitelistContract: string;
}
export class SetDistributedLockerDto {
  @IsString()
  @MaxLength(128)
  id: string;

  @IsString()
  @MaxLength(128)
  lockerDistributeHash: string;
}
export class SetContractPresaleDto {
  @IsString()
  @MaxLength(128)
  id: string;

  @IsString()
  @MaxLength(128)
  contractAddress: string;

  @IsString()
  @MaxLength(128)
  whitelistContract: string;
}
export class AddAirdropItemDto {
  @IsString()
  address: string;
  @IsString()
  amount: string;
  @IsString()
  startDateCliam: string;
  @IsString()
  endDateCliam: string;
}
export class AddAirdropDto {
  @IsUUID()
  projectId: string;

  @IsArray()
  @IsOptional()
  @ValidateNested()
  @Type(() => AddAirdropItemDto)
  airdrops?: AddAirdropItemDto[];
}

export class SetRewardContractPresaleDto {
  @IsString()
  @MaxLength(128)
  id: string;

  @IsString()
  @MaxLength(128)
  rewardContractAddress: string;
}
export class SetRewardContractPresaleScheduleIdDto {
  @IsString()
  @MaxLength(128)
  id: string;

  @IsString()
  @MaxLength(128)
  scheduleId: string;
}

export class ProjectAllocationAddressItemDto {
  @IsString()
  address: string;
  @IsString()
  amount: string;
}
export class CreateProjectAllocationAddressDto {
  @IsUUID()
  projectAllocationId: string;

  @IsArray()
  @IsOptional()
  @ValidateNested()
  @Type(() => ProjectAllocationAddressItemDto)
  items: ProjectAllocationAddressItemDto[];
}
export class DeleteProjectAllocationAddressIdsDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('4', { each: true })
  ids: string[];
}
export class DeleteProjectAllocationAddressDto {
  @IsArray()
  @ArrayNotEmpty()
  adresses: string[];
}

export class SetPausedProjectDto {
  @IsString()
  @MaxLength(128)
  id: string;
}

export class SetContractPresaleProjectDto {
  @IsString()
  @MaxLength(128)
  id: string;

  @IsString()
  @MaxLength(128)
  presaleAddress: string;
}
export class CreatePaymentHistoryDto {
  @IsEnum(PaymentHistoryType)
  type: PaymentHistoryType;

  @IsString()
  address: string;

  @IsUUID()
  @IsOptional()
  projectId?: string;

  @IsUUID()
  @IsOptional()
  presaleId?: string;

  @IsString()
  amount: string;

  @IsString()
  unit: string;

  @IsOptional()
  @IsString()
  transactionHash?: string;
}
export class UpdateProjectDto extends PartialType(CreateProjectDto) {}
