import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSocialDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  icon?: string;
}
