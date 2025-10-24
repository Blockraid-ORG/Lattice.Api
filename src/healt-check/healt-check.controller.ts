import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';

@Controller('healt-check')
export class HealtCheckController {
  @HttpCode(HttpStatus.OK)
  @Get()
  findAll() {
    return { status: 'ok' };
  }
}
