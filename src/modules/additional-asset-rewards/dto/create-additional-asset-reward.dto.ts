import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateAdditionalAssetRewardDto {
  @IsNotEmpty()
  @IsUUID()
  projectId: string;

  @IsNotEmpty()
  @IsString()
  amount: string;

  @IsNotEmpty()
  @IsString()
  startDateClaim: Date;

  @IsNotEmpty()
  @IsString()
  endDateClaim: string;

  @IsOptional()
  @IsString()
  scheduleId?: string;

  @IsOptional()
  @IsString()
  contractAddress?: string;
}
export class SetAllocationAirdropDto {
  @IsNotEmpty()
  @IsUUID()
  additionalRewardId: string;

  @IsNotEmpty()
  address: string;

  @IsNotEmpty()
  amount: string;
}
export class RemoveAllocationAirdropDto {
  @IsNotEmpty()
  @IsUUID()
  additionalRewardId: string;

  @IsNotEmpty()
  address: string;
}
export class SetUserRewardClaimedDto {
  @IsNotEmpty()
  @IsUUID()
  id: string;
}
