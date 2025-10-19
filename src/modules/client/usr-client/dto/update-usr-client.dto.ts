import { PartialType } from '@nestjs/mapped-types';
import { CreateUsrClientDto } from './create-usr-client.dto';

export class UpdateUsrClientDto extends PartialType(CreateUsrClientDto) {}
