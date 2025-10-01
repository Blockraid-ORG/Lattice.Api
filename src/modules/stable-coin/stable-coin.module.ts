import { Module } from '@nestjs/common';
import { StableCoinService } from './stable-coin.service';
import { StableCoinController } from './stable-coin.controller';

@Module({
  controllers: [StableCoinController],
  providers: [StableCoinService],
})
export class StableCoinModule {}
