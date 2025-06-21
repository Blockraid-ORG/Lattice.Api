import { PartialType } from '@nestjs/mapped-types';
import { CreateMasterVerificationDto } from './create-master-verification.dto';

export class UpdateMasterVerificationDto extends PartialType(CreateMasterVerificationDto) {}
