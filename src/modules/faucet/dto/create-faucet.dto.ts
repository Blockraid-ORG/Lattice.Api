import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateFaucetDto {
  @IsOptional()
  @IsString()
  address?: string;

  @IsNotEmpty()
  @IsString()
  amount: string;

  @IsNotEmpty()
  @IsString()
  unit: string;
}
