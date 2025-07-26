import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';
export class CreateProfileDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  fullname: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @IsEmail()
  email: string;
}
