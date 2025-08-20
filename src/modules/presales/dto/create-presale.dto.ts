import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

export class CreatePresaleDto {
  @IsUUID()
  projectId: string;

  @IsUUID()
  presaleId: string;

  // @IsUUID()
  // userId: string;

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
