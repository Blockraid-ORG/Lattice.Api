import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectVerificationDto } from './create-project-verification.dto';

export class UpdateProjectVerificationDto extends PartialType(CreateProjectVerificationDto) {}
