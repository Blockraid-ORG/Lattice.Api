import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Project } from '@prisma/client';
import { createPaginator } from 'prisma-pagination';
import { QueryParamDto } from 'src/common/pagination/dto/pagination.dto';
import { parseBoolean } from 'src/common/utils/parse-data-type';
import { PrismaService } from 'src/prisma/prisma.service';
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
import { add } from 'date-fns';
@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}
  async create(dto: CreateProjectDto, userId: string) {
    const {
      chainIds,
      allocations,
      socials,
      presales,
      additionalReward,
      ...projectData
    } = dto;
    const pType = await this.prisma.projectType.findUnique({
      where: {
        id: dto.projectTypeId,
      },
    });
    const prefixTypeName = pType ? pType.name.charAt(0) : '';
    const newAllocations = allocations.map((item, index) => {
      return {
        ...item,
        sortNumber: index,
      };
    });
    return this.prisma.project.create({
      data: {
        ...projectData,
        ticker: `${prefixTypeName}${dto.ticker}`,
        userId,

        chains: {
          create: chainIds.map((chainId) => ({
            chain: { connect: { id: chainId } },
          })),
        },

        allocations: {
          create: newAllocations.map((a) => ({
            ...a,
          })),
        },

        socials: {
          create: socials.map((s) => ({
            url: s.url,
            social: { connect: { id: s.socialId } },
          })),
        },

        presales: presales
          ? {
              create: {
                ...presales,
                endDate: add(new Date(presales.startDate), {
                  days: presales.duration,
                }),
              },
            }
          : undefined,
        additionalReward:
          additionalReward && additionalReward.length
            ? {
                create: additionalReward.map((ar) => ({
                  ...ar,
                })),
              }
            : undefined,
      },
      include: {
        chains: { include: { chain: true } },
        allocations: true,
        socials: { include: { social: true } },
        presales: true,
      },
    });
  }

  async update(id: string, dto: UpdateProjectDto, userId: string) {
    const {
      chainIds,
      allocations,
      socials,
      presales,
      additionalReward,
      ...projectData
    } = dto;
    return this.prisma.project.update({
      where: { id },
      data: {
        ...projectData,
        userId,
        status: 'PENDING',
        chains: {
          deleteMany: {},
          create: chainIds.map((chainId) => ({
            chain: { connect: { id: chainId } },
          })),
        },

        allocations: {
          deleteMany: {},
          create: allocations.map((a) => ({
            ...a,
          })),
        },

        socials: {
          deleteMany: {},
          create: socials.map((s) => ({
            url: s.url,
            social: { connect: { id: s.socialId } },
          })),
        },
        presales: presales
          ? {
              deleteMany: {}, // hapus semua dulu
              create: {
                ...presales,
                endDate: add(new Date(presales.startDate), {
                  days: presales.duration,
                }),
              },
            }
          : { deleteMany: {} },
        additionalReward: additionalReward
          ? {
              upsert: additionalReward.map((reward) => ({
                where: { id: reward.userId ?? '' },
                update: {
                  address: reward.address,
                  amount: reward.amount,
                  typeId: reward.typeId,
                  userId,
                  startDateCliam: reward.startDateCliam,
                  endDateCliam: reward.endDateCliam,
                },
                create: {
                  address: reward.address,
                  amount: reward.amount,
                  typeId: reward.typeId,
                  userId,
                  startDateCliam: reward.startDateCliam,
                  endDateCliam: reward.endDateCliam,
                },
              })),
            }
          : {
              deleteMany: {},
            },
      },
      include: {
        chains: { include: { chain: true } },
        allocations: true,
        socials: { include: { social: true } },
        presales: true,
        additionalReward: true,
      },
    });
  }

  async findMany(query: QueryParamDto) {
    if (parseBoolean(query.noPaginate)) {
      return this.noPagination(query);
    }
    return this.withPagination(query);
  }
  async findOne(id: string) {
    const result = await this.prisma.project.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        slug: true,
        logo: true,
        banner: true,
        ticker: true,
        decimals: true,
        totalSupply: true,
        detail: true,
        status: true,
        contractAddress: true,
        factoryAddress: true,
        lockerDistributed: true,
        lockerDistributeHash: true,
        rewardContractAddress: true,
        presaleAddress: true,
        whitelistsAddress: true,
        PaymentHistory: true,
        ProjectPresaleWhitelistAddress: {
          select: {
            id: true,
            walletAddress: true,
            projectId: true,
          },
        },
        paused: true,
        projectType: {
          select: {
            id: true,
            name: true,
            icon: true,
          },
        },
        reviewLogs: {
          select: {
            id: true,
            status: true,
            note: true,
            createdAt: true,
            createdBy: true,
          },
        },
        socials: {
          select: {
            url: true,
            social: {
              select: {
                id: true,
                name: true,
                icon: true,
              },
            },
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            icon: true,
          },
        },
        chains: {
          select: {
            chain: {
              select: {
                id: true,
                name: true,
                logo: true,
                ticker: true,
                urlScanner: true,
                urlRpc: true,
                chainid: true,
                type: true,
                aliasName: true,
              },
            },
          },
        },
        allocations: {
          orderBy: [{ createdAt: 'asc' }, { sortNumber: 'asc' }],
          select: {
            id: true,
            name: true,
            supply: true,
            vesting: true,
            startDate: true,
            isPresale: true,
            contractAddress: true,
            isDeploying: true,
            isFinalized: true,
            addresses: {
              select: {
                id: true,
                address: true,
                amount: true,
                isClaimed: true,
              },
            },
            _count: {
              select: {
                addresses: true,
              },
            },
          },
        },
        presales: {
          where: { deletedAt: null },
          orderBy: [{ presaleSCID: 'desc' }, { createdAt: 'desc' }],
          select: {
            id: true,
            hardcap: true,
            price: true,
            maxContribution: true,
            duration: true,
            unit: true,
            claimTime: true,
            contractAddress: true,
            whitelistContract: true,
            sweepDuration: true,
            startDate: true,
            endDate: true,
            whitelistDuration: true,
            isActive: true,
            presaleSCID: true,
            isWithdrawn: true,
            whitelists: {
              select: {
                id: true,
                walletAddress: true,
              },
            },
          },
        },
        transactionPresales: {
          select: {
            id: true,
            user: {
              select: {
                id: true,
                walletAddress: true,
                fullname: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            fullname: true,
            walletAddress: true,
            type: true,
            status: true,
            verifications: {
              select: {
                userId: true,
                verificationId: true,
                status: true,
              },
            },
          },
        },
        additionalReward: {
          select: {
            id: true,
            amount: true,
            contactAddress: true,
            type: {
              select: {
                id: true,
                name: true,
              },
            },
            startDateClaim: true,
            endDateClaim: true,
            scheduleId: true,
            project: {
              select: {
                rewardContractAddress: true,
              },
            },
          },
        },
      },
    });
    if (!result) {
      throw new NotFoundException(`data with ${id} not found!`);
    }
    const hasAirdrop = result.allocations.some(
      (a) => a.name.toLowerCase() === 'airdrop',
    );
    return {
      ...result,
      isHashAirdrop: hasAirdrop,
    };
  }

  async reject(dto: CreateReviewProjectDto) {
    const result = await this.prisma.$transaction(async (tx) => {
      await tx.project.update({
        where: {
          id: dto.projectId,
        },
        data: {
          status: dto.status,
        },
      });
      await tx.projectReviewLog.create({
        data: dto,
      });
    });
    return result;
  }
  async approve(dto: CreateReviewProjectDto) {
    const result = await this.prisma.$transaction(async (tx) => {
      await tx.project.update({
        where: {
          id: dto.projectId,
        },
        data: {
          status: dto.status,
        },
      });
      await tx.projectReviewLog.create({
        data: dto,
      });
    });
    return result;
  }

  private async withPagination(query: QueryParamDto) {
    const paginate = createPaginator({
      page: query.page,
      perPage: query.pageSize,
    });
    const orderField = query.sortBy || 'createdAt';
    const orderType = query.sortType || 'desc';
    const orderBy = { [orderField]: orderType };
    const result = await paginate<Project, Prisma.ProjectFindManyArgs>(
      this.prisma.project,
      {
        where: {
          ...(query.status && { status: query.status }),
          ...(query.userId && { userId: query.userId }),
          ...(query.categoryId && { categoryId: query.categoryId }),
          OR: query?.search
            ? [{ name: { contains: query.search, mode: 'insensitive' } }]
            : undefined,
        },
        orderBy,
        select: {
          id: true,
          name: true,
          slug: true,
          logo: true,
          banner: true,
          ticker: true,
          decimals: true,
          totalSupply: true,
          detail: true,
          status: true,
          userId: true,
          contractAddress: true,
          rewardContractAddress: true,
          paused: true,
          PaymentHistory: true,
          socials: {
            select: {
              url: true,
              social: {
                select: {
                  id: true,
                  name: true,
                  icon: true,
                },
              },
            },
          },
          category: {
            select: {
              id: true,
              name: true,
              icon: true,
            },
          },
          projectType: {
            select: {
              id: true,
              name: true,
              icon: true,
            },
          },
          chains: {
            select: {
              chain: {
                select: {
                  id: true,
                  name: true,
                  logo: true,
                  type: true,
                  aliasName: true,
                },
              },
            },
          },
        },
      },
    );
    return result;
  }
  private async noPagination(query: QueryParamDto) {
    const orderField = query.sortBy || 'createdAt';
    const orderType = query.sortType || 'desc';
    const orderBy = { [orderField]: orderType };
    return this.prisma.project.findMany({
      where: {
        OR: query?.search
          ? [{ name: { contains: query.search, mode: 'insensitive' } }]
          : undefined,
      },
      orderBy,
      select: {
        id: true,
        name: true,
        slug: true,
        logo: true,
        banner: true,
        ticker: true,
        decimals: true,
        totalSupply: true,
        detail: true,
        status: true,
        userId: true,
        contractAddress: true,
        rewardContractAddress: true,
        PaymentHistory: true,
        paused: true,
        socials: {
          select: {
            url: true,
            social: {
              select: {
                id: true,
                name: true,
                icon: true,
              },
            },
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            icon: true,
          },
        },
        projectType: {
          select: {
            id: true,
            name: true,
            icon: true,
          },
        },
        chains: {
          select: {
            chain: {
              select: {
                id: true,
                name: true,
                logo: true,
                type: true,
                aliasName: true,
              },
            },
          },
        },
      },
    });
  }

  async setAssetPause(dto: SetPausedProjectDto) {
    const project = await this.prisma.project.findUnique({
      where: { id: dto.id },
    });
    return this.prisma.project.update({
      where: {
        id: dto.id,
      },
      data: {
        paused: !project.paused,
      },
    });
  }

  async updateAllocation(dto: UpdateAllocationDto) {
    const result = await this.prisma.projectAllocation.update({
      where: {
        id: dto.id,
      },
      data: {
        contractAddress: dto.contractAddress,
        isDeploying: false,
      },
    });
    return result;
  }
  async setAllocationDeploying(dto: SetAllocationDeployingDto[]) {
    const result = await this.prisma.$transaction(
      dto.map(({ id }) =>
        this.prisma.projectAllocation.update({
          where: { id },
          data: {
            isDeploying: true,
          },
        }),
      ),
    );
    return result;
  }
  async setContractWhitelist(dto: SetContractWhitelistDto) {
    const result = await this.prisma.presales.update({
      where: {
        id: dto.id,
      },
      data: {
        whitelistContract: dto.whitelistContract,
      },
    });
    return result;
  }
  async setContractPresale(dto: SetContractPresaleDto) {
    const result = await this.prisma.presales.update({
      where: {
        id: dto.id,
      },
      data: {
        whitelistContract: dto.whitelistContract,
        contractAddress: dto.contractAddress,
      },
    });
    return result;
  }

  async setDistributedLocker(dto: SetDistributedLockerDto) {
    const result = await this.prisma.project.update({
      where: {
        id: dto.id,
      },
      data: {
        lockerDistributed: true,
        lockerDistributeHash: dto.lockerDistributeHash,
      },
    });
    return result;
  }
  async addAirdrop(dto: AddAirdropDto) {
    const { projectId, airdrops } = dto;
    const rewardTypeAirdrop = await this.prisma.additionalRewardType.findFirst({
      where: {
        name: 'Airdrop',
      },
    });
    if (!rewardTypeAirdrop) {
      throw new BadRequestException('Airdrop Not Available');
    }
    const addresses = airdrops.map((a) => a.address);
    const users = await this.prisma.user.findMany({
      where: {
        walletAddress: { in: addresses },
      },
      select: { id: true, walletAddress: true },
    });
    const walletAddressMapped = airdrops.map((i) => {
      return {
        ...i,
        projectId,
        typeId: rewardTypeAirdrop.id,
        userId: users.find(
          (u) => u.walletAddress.toLowerCase() === i.address.toLowerCase(),
        ).id,
      };
    });
    const result = await this.prisma.additionalReward.createMany({
      data: walletAddressMapped,
      skipDuplicates: true,
    });
    return result;
  }
  async setRewardContractAddress(dto: SetRewardContractPresaleDto) {
    const result = await this.prisma.project.update({
      where: {
        id: dto.id,
      },
      data: {
        rewardContractAddress: dto.rewardContractAddress,
      },
    });
    return result;
  }
  async setRewardContractAddressScheduleId(
    dto: SetRewardContractPresaleScheduleIdDto,
  ) {
    const result = await this.prisma.additionalReward.update({
      where: {
        id: dto.id,
      },
      data: {
        scheduleId: dto.scheduleId,
      },
    });
    return result;
  }
  async createProjectAllocationAddress(dto: CreateProjectAllocationAddressDto) {
    const newData = dto.items.map((item) => {
      return {
        ...item,
        projectAllocationId: dto.projectAllocationId,
      };
    });
    const result = await this.prisma.projectAllocationAddress.createMany({
      data: newData,
      skipDuplicates: true,
    });
    return result;
  }
  async deleteIdsProjectAllocationAddress(
    dto: DeleteProjectAllocationAddressIdsDto,
  ) {
    const result = await this.prisma.projectAllocationAddress.deleteMany({
      where: {
        id: {
          in: dto.ids,
        },
      },
    });
    return result;
  }
  async deleteProjectAllocationAddress(dto: DeleteProjectAllocationAddressDto) {
    const result = await this.prisma.projectAllocationAddress.deleteMany({
      where: {
        address: {
          in: dto.adresses,
        },
      },
    });
    return result;
  }
  async finalizeProjectAllocation(id: string) {
    const result = await this.prisma.projectAllocation.update({
      where: { id },
      data: {
        isFinalized: true,
      },
    });
    return result;
  }
  async setContractPresaleProject(dto: SetContractPresaleProjectDto) {
    const result = await this.prisma.project.update({
      where: {
        id: dto.id,
      },
      data: {
        presaleAddress: dto.presaleAddress,
      },
    });
    return result;
  }
  async createPaymentHistory(dto: CreatePaymentHistoryDto) {
    const result = await this.prisma.paymentHistory.create({
      data: dto,
    });
    return result;
  }
}
