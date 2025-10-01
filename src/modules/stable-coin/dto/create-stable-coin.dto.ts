import { IsNumber, IsString, IsUUID } from 'class-validator';

export class CreateStableCoinDto {
  @IsUUID()
  chainId: string;

  @IsUUID()
  stableCoinGroupId: string;

  @IsString()
  address: string;

  @IsNumber()
  decimal: number;
}
