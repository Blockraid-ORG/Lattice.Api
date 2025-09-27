import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAddressPoolPaymentDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsString()
  ticker: string;

  @IsNotEmpty()
  @IsString()
  amountFee: string;
}
