import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProjectTypeDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  icon?: string;

  @IsOptional()
  @IsNumber()
  order?: number;
}
