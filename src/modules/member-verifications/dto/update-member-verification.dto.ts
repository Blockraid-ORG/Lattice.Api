import { PartialType } from '@nestjs/mapped-types';
import { CreateMemberVerificationDto } from './create-member-verification.dto';

export class UpdateMemberVerificationDto extends PartialType(
  CreateMemberVerificationDto,
) {}
