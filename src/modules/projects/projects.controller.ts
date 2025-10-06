import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PermissionGuard } from 'src/auth/auth.guard';
import { CurrentUserId } from 'src/common/decorators/current-user.decorator';
import { QueryParamDto } from 'src/common/pagination/dto/pagination.dto';
import {
  AddAirdropDto,
  CreatePaymentHistoryDto,
  CreateProjectAllocationAddressDto,
  CreateProjectDto,
  CreateReviewProjectDto,
  DeleteProjectAllocationAddressDto,
  DeleteProjectAllocationAddressIdsDto,
  SetAllocationDeployingDto,
  SetContractPresaleDto,
  SetContractPresaleProjectDto,
  SetContractWhitelistDto,
  SetDistributedLockerDto,
  SetPausedProjectDto,
  SetRewardContractPresaleDto,
  SetRewardContractPresaleScheduleIdDto,
  UpdateAllocationDto,
  UpdateProjectDto,
} from './dto/create-project-dto';
import { ProjectsService } from './projects.service';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get('upcoming')
  findUpcomingProject(@Query() query: QueryParamDto) {
    return this.projectsService.findMany({
      ...query,
      status: {
        in: ['PENDING', 'APPROVED'],
      },
    });
  }

  @UseGuards(AuthGuard('jwt'), PermissionGuard)
  @Post()
  async create(@Body() dto: CreateProjectDto, @CurrentUserId() userId: string) {
    return this.projectsService.create(dto, userId);
  }

  @UseGuards(AuthGuard('jwt'), PermissionGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateProjectDto,
    @CurrentUserId() userId: string,
  ) {
    return this.projectsService.update(id, dto, userId);
  }

  @UseGuards(AuthGuard('jwt'), PermissionGuard)
  @Get()
  findMany(@Query() query: QueryParamDto) {
    return this.projectsService.findMany(query);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  findMyProject(
    @Query() query: QueryParamDto,
    @CurrentUserId() userId: string,
  ) {
    return this.projectsService.findMany({
      ...query,
      userId,
    });
  }
  @UseGuards(AuthGuard('jwt'))
  @Post('set-pause')
  @HttpCode(HttpStatus.OK)
  async setAssetPause(@Body() dto: SetPausedProjectDto) {
    return this.projectsService.setAssetPause(dto);
  }

  // @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'), PermissionGuard)
  @Post('reject')
  @HttpCode(HttpStatus.OK)
  async reject(@Body() dto: CreateReviewProjectDto) {
    return this.projectsService.reject(dto);
  }
  @UseGuards(AuthGuard('jwt'), PermissionGuard)
  @Post('approve')
  @HttpCode(HttpStatus.OK)
  async approve(@Body() dto: CreateReviewProjectDto) {
    return this.projectsService.approve(dto);
  }
  @UseGuards(AuthGuard('jwt'))
  @Post('update-allocation')
  @HttpCode(HttpStatus.OK)
  async updateAllocation(@Body() dto: UpdateAllocationDto) {
    return this.projectsService.updateAllocation(dto);
  }
  @UseGuards(AuthGuard('jwt'))
  @Post('set-allocation-deploy')
  @HttpCode(HttpStatus.OK)
  async setAllocationDeploying(@Body() dto: SetAllocationDeployingDto[]) {
    return this.projectsService.setAllocationDeploying(dto);
  }
  @UseGuards(AuthGuard('jwt'))
  @Post('set-contract-whitelist')
  @HttpCode(HttpStatus.OK)
  async setContractWhitelist(@Body() dto: SetContractWhitelistDto) {
    return this.projectsService.setContractWhitelist(dto);
  }
  @UseGuards(AuthGuard('jwt'))
  @Post('set-contract-presale')
  @HttpCode(HttpStatus.OK)
  async setContractPresale(@Body() dto: SetContractPresaleDto) {
    return this.projectsService.setContractPresale(dto);
  }
  @UseGuards(AuthGuard('jwt'))
  @Post('set-distributed-locker')
  @HttpCode(HttpStatus.OK)
  async setDistributedLocker(@Body() dto: SetDistributedLockerDto) {
    return this.projectsService.setDistributedLocker(dto);
  }
  @UseGuards(AuthGuard('jwt'))
  @Post('add-airdrop')
  @HttpCode(HttpStatus.OK)
  async addAirdrop(@Body() dto: AddAirdropDto) {
    return this.projectsService.addAirdrop(dto);
  }
  @UseGuards(AuthGuard('jwt'))
  @Post('set-reward-contract-address')
  @HttpCode(HttpStatus.OK)
  async setRewardContractAddress(@Body() dto: SetRewardContractPresaleDto) {
    return this.projectsService.setRewardContractAddress(dto);
  }
  @UseGuards(AuthGuard('jwt'))
  @Post('set-reward-schedule-id')
  @HttpCode(HttpStatus.OK)
  async setRewardContractAddressScheduleId(
    @Body() dto: SetRewardContractPresaleScheduleIdDto,
  ) {
    return this.projectsService.setRewardContractAddressScheduleId(dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('create-locker-allocation-address')
  @HttpCode(HttpStatus.OK)
  async createProjectAllocationAddress(
    @Body() dto: CreateProjectAllocationAddressDto,
  ) {
    return this.projectsService.createProjectAllocationAddress(dto);
  }
  @UseGuards(AuthGuard('jwt'))
  @Post('delete-ids-locker-allocation-address')
  @HttpCode(HttpStatus.OK)
  async deleteIdsProjectAllocationAddress(
    @Body() dto: DeleteProjectAllocationAddressIdsDto,
  ) {
    return this.projectsService.deleteIdsProjectAllocationAddress(dto);
  }
  @UseGuards(AuthGuard('jwt'))
  @Post('delete-locker-allocation-address')
  @HttpCode(HttpStatus.OK)
  async deleteProjectAllocationAddress(
    @Body() dto: DeleteProjectAllocationAddressDto,
  ) {
    return this.projectsService.deleteProjectAllocationAddress(dto);
  }
  @UseGuards(AuthGuard('jwt'))
  @Post('finalize-locker-allocation')
  @HttpCode(HttpStatus.OK)
  async finalizeProjectAllocation(@Body('id') id: string) {
    return this.projectsService.finalizeProjectAllocation(id);
  }
  @UseGuards(AuthGuard('jwt'))
  @Post('set-contract-presale-project')
  @HttpCode(HttpStatus.OK)
  async setContractPresaleProject(@Body() dto: SetContractPresaleProjectDto) {
    return this.projectsService.setContractPresaleProject(dto);
  }
  @UseGuards(AuthGuard('jwt'))
  @Post('create-payment-history')
  @HttpCode(HttpStatus.OK)
  async createPaymentHistory(@Body() dto: CreatePaymentHistoryDto) {
    return this.projectsService.createPaymentHistory(dto);
  }
}
