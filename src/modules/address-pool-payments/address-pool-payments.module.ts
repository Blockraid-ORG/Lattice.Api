import { Module } from '@nestjs/common';
import { AddressPoolPaymentsService } from './address-pool-payments.service';
import { AddressPoolPaymentsController } from './address-pool-payments.controller';

@Module({
  controllers: [AddressPoolPaymentsController],
  providers: [AddressPoolPaymentsService],
})
export class AddressPoolPaymentsModule {}
