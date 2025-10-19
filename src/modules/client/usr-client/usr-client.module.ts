import { Module } from '@nestjs/common';
import { UsrClientService } from './usr-client.service';
import { UsrClientController } from './usr-client.controller';

@Module({
  controllers: [UsrClientController],
  providers: [UsrClientService],
})
export class UsrClientModule {}
