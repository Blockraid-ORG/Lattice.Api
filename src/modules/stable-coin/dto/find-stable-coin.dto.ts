import { IsString, IsUUID } from 'class-validator';

export class FindUsedStableCoinDto {
  @IsUUID()
  chainId: string;

  @IsString()
  name: string;
}
