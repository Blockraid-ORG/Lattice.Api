import { PartialType } from '@nestjs/mapped-types';
import { CreateAddressPoolPaymentDto } from './create-address-pool-payment.dto';

export class UpdateAddressPoolPaymentDto extends PartialType(CreateAddressPoolPaymentDto) {}
