import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateAdditionalAssetRewardDto {
  @IsNotEmpty()
  @IsUUID()
  projectId: string;

  @IsNotEmpty()
  @IsUUID()
  typeId: string;

  @IsNotEmpty()
  @IsString()
  amount: string;

  @IsNotEmpty()
  @IsString()
  startDateClaim: Date;

  @IsNotEmpty()
  @IsString()
  endDateClaim: string;
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
