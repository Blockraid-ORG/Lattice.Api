import { IsUUID } from 'class-validator';

export class FindMyContributeDto {
  @IsUUID()
  projectId: string;

  @IsUUID()
  presaleId: string;
}
