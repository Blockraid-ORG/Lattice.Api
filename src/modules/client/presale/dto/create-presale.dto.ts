import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreatePresaleDto {}

export class AddWhitelistDto {
  @IsNotEmpty()
  @IsString()
  presaleId: string;

  @IsArray()
  @IsString({ each: true })
  walletAddress: string[];
}
