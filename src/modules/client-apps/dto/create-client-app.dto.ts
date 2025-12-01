import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateClientAppDto {
  @IsNotEmpty()
  @IsString()
  code: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  url?: string;
}
