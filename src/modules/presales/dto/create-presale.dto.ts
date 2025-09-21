import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreatePresaleDto {
  @IsUUID()
  projectId: string;

  @IsUUID()
  presaleId: string;

  @IsString()
  @IsNotEmpty()
  price: string;

  @IsNotEmpty()
  @IsNumber()
  count: number;

  @IsNotEmpty()
  @IsString()
  transactionHash: string;
}

export class FindMyContributeDto {
  @IsUUID()
  projectId: string;

  @IsUUID()
  presaleId: string;
}

export class CreateNewPresaleDto {
  @IsUUID()
  projectId: string;

  // @IsUUID()
  // chainId: string;

  @IsString()
  @IsNotEmpty()
  price: string;

  @IsString()
  @IsNotEmpty()
  hardcap: string;

  @IsString()
  @IsNotEmpty()
  unit: string;

  @IsNumber()
  @IsNotEmpty()
  maxContribution: number;

  @IsNumber()
  @IsNotEmpty()
  duration: number;

  @IsString()
  @IsNotEmpty()
  startDate: string;

  // @IsString()
  // @IsNotEmpty()
  // endDate: string;

  @IsNumber()
  @IsNotEmpty()
  claimTime: number;

  @IsNumber()
  @IsOptional()
  whitelistDuration?: number;

  @IsNumber()
  @IsOptional()
  sweepDuration?: number;

  @IsString()
  @IsOptional()
  contractAddress?: string;

  @IsNumber()
  @IsOptional()
  presaleSCID?: number;
}
export class ActivateNewPresaleDto {
  @IsUUID()
  id: string;

  @IsNumber()
  @IsOptional()
  presaleSCID: number;
}
export class AddProjectAddressWhitelistDto {
  @IsUUID()
  projectId: string;

  @IsString()
  walletAddress: string;
}
