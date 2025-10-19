import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateAddressPoolPaymentDto {
  @IsNotEmpty()
  @IsString()
  paymentSc: string;

  @IsOptional()
  @IsString()
  stableCoinId: string;

  @IsNotEmpty()
  @IsString()
  listingFee: string;

  @IsNotEmpty()
  @IsNumber()
  presaleFee: number;
}
