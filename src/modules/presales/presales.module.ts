import { Module } from '@nestjs/common';
import { PresalesService } from './presales.service';
import { PresalesController } from './presales.controller';

@Module({
  controllers: [PresalesController],
  providers: [PresalesService],
})
export class PresalesModule {}
