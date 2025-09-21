import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreatePresaleDto {}

export class AddWhitelistDto {
  @IsNotEmpty()
  @IsString()
  presaleId: string;

  @IsArray()
  @IsString({ each: true })
  walletAddress: string[];
}

export class CreateClaimPresaleDto {
  @IsNotEmpty()
  @IsString()
  presaleId: string;

  @IsOptional()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  transactionHash: string;

  @IsNotEmpty()
  @IsString()
  amount: string;
}

export class GetClaimPresaleDto {
  @IsNotEmpty()
  @IsString()
  presaleId: string;
}
export class CreateTransactionPresaleDto {
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
