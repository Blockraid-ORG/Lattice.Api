import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdditionalAssetRewardsService } from './additional-asset-rewards.service';
import {
  CreateAdditionalAssetRewardDto,
  RemoveAllocationAirdropDto,
  SetAllocationAirdropDto,
  SetUserRewardClaimedDto,
} from './dto/create-additional-asset-reward.dto';
import { UpdateAdditionalAssetRewardDto } from './dto/update-additional-asset-reward.dto';
import { QueryParamDto } from 'src/common/pagination/dto/pagination.dto';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUserId } from 'src/common/decorators/current-user.decorator';

@UseGuards(AuthGuard('jwt'))
@Controller('additional-asset-rewards')
export class AdditionalAssetRewardsController {
  constructor(private readonly service: AdditionalAssetRewardsService) {}

  @Post('set-user-allocation-claim')
  setUserRewardClaimed(@Body() dto: SetUserRewardClaimedDto) {
    return this.service.setUserRewardClaimed(dto);
  }

  @Post('setAllocations')
  setAllocations(@Body() dto: SetAllocationAirdropDto[]) {
    return this.service.setAllocations(dto);
  }
  @Post('removeAllocations')
  removeAllocations(@Body() dto: RemoveAllocationAirdropDto[]) {
    return this.service.removeAllocations(dto);
  }
  @Get('get-eligible-airdrop')
  findEligibleAirdrop(
    @Query() query: QueryParamDto,
    @CurrentUserId() userId: string,
  ) {
    return this.service.findEligibleAirdrop(query, userId);
  }

  @Post()
  create(@Body() dto: CreateAdditionalAssetRewardDto) {
    return this.service.create(dto);
  }

  @Get()
  findMany(@Query() query: QueryParamDto) {
    return this.service.findMany(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateAdditionalAssetRewardDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
