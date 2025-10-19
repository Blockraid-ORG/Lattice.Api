import { PartialType } from '@nestjs/mapped-types';
import { CreateNewPresaleDto, CreatePresaleDto } from './create-presale.dto';

export class UpdatePresaleDto extends PartialType(CreatePresaleDto) {}
export class UpdateNewPresaleDto extends PartialType(CreateNewPresaleDto) {}
