import { IsNotEmpty, IsString } from 'class-validator';
export class JwtPayload {
  userId: string;
}
export class BindAcccountDto {
  @IsNotEmpty()
  @IsString()
  email: string;
}
