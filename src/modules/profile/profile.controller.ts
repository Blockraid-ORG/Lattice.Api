import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUserId } from 'src/common/decorators/current-user.decorator';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfileService } from './profile.service';

@UseGuards(AuthGuard('jwt'))
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}
  @Get()
  findMe(@CurrentUserId() userId: string) {
    return this.profileService.findMe(userId);
  }

  @HttpCode(HttpStatus.OK)
  @Post()
  async update(@Body() dto: UpdateProfileDto, @CurrentUserId() userId: string) {
    return this.profileService.update(dto, userId);
  }
}
