import { PartialType } from '@nestjs/mapped-types';
import { CreatePresaleDto } from './create-presale.dto';

export class UpdatePresaleDto extends PartialType(CreatePresaleDto) {}
