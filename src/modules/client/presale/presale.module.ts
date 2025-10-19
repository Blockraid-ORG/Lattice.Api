import { Module } from '@nestjs/common';
import { PresaleService } from './presale.service';
import { PresaleController } from './presale.controller';

@Module({
  controllers: [PresaleController],
  providers: [PresaleService],
})
export class PresaleModule {}
