import { Injectable } from '@nestjs/common';
import {
  CreateAdditionalAssetRewardDto,
  RemoveAllocationAirdropDto,
  SetAllocationAirdropDto,
} from './dto/create-additional-asset-reward.dto';
import { UpdateAdditionalAssetRewardDto } from './dto/update-additional-asset-reward.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { QueryParamDto } from 'src/common/pagination/dto/pagination.dto';
import { createPaginator } from 'prisma-pagination';
import { AdditionalReward, Prisma } from '@prisma/client';
import { parseBoolean } from 'src/common/utils/parse-data-type';

@Injectable()
export class AdditionalAssetRewardsService {
  constructor(private readonly prisma: PrismaService) {}
  async setAllocations(dto: SetAllocationAirdropDto[]) {
    const addesses = dto.map((i) => i.address);
    const users = await this.prisma.user.findMany({
      where: {
        walletAddress: {
          in: addesses,
          mode: 'insensitive',
        },
      },
    });
    const newData = users.map((user, index) => {
      return {
        userId: user.id,
        additionalRewardId: dto[index].additionalRewardId,
        amount: dto[index].amount,
        address: user.walletAddress,
      };
    });
    return this.prisma.userAdditionalReward.createMany({
      data: newData,
    });
  }
  removeAllocations(dto: RemoveAllocationAirdropDto[]) {
    return this.prisma.userAdditionalReward.deleteMany({
      where: {
        address: {
          in: dto.map((i) => i.address),
          mode: 'insensitive',
        },
        additionalRewardId: {
          in: dto.map((i) => i.additionalRewardId),
        },
      },
    });
  }
  async create(dto: CreateAdditionalAssetRewardDto) {
    const projectType = await this.prisma.additionalRewardType.findFirst({
      where: { name: 'Airdrop', status: true },
    });
    if (!projectType) {
      throw new Error('Project type not found');
    }
    return this.prisma.additionalReward.create({
      data: {
        amount: dto.amount,
        projectId: dto.projectId,
        typeId: projectType.id,
        startDateClaim: new Date(dto.startDateClaim),
        endDateClaim: new Date(dto.endDateClaim),
      },
    });
  }
  async findMany(query: QueryParamDto) {
    if (parseBoolean(query.noPaginate)) {
      return this.noPagination(query);
    }
    return this.withPagination(query);
  }

  findOne(id: string) {
    return this.prisma.additionalReward.findUnique({
      where: { id },
      select: {
        id: true,
        amount: true,
        endDateClaim: true,
        startDateClaim: true,
        contactAddress: true,
        project: {
          select: {
            id: true,
            name: true,
            ticker: true,
            contractAddress: true,
            decimals: true,
            chains: {
              select: {
                chain: {
                  select: {
                    id: true,
                    urlScanner: true,
                  },
                },
              },
            },
          },
        },
        type: {
          select: {
            name: true,
          },
        },
        userAdditionalReward: {
          select: {
            id: true,
            address: true,
            amount: true,
            isClaimed: true,
            user: {
              select: {
                fullname: true,
              },
            },
          },
        },
      },
    });
  }
  update(id: string, dto: UpdateAdditionalAssetRewardDto) {
    return this.prisma.additionalReward.update({
      where: { id },
      data: dto,
    });
  }

  remove(id: string) {
    return this.prisma.additionalReward.delete({
      where: {
        id,
        contactAddress: {
          not: null,
        },
      },
    });
  }
  private async withPagination(query: QueryParamDto) {
    const paginate = createPaginator({
      page: query.page,
      perPage: query.pageSize,
    });
    const orderField = query.sortBy || 'createdAt';
    const orderType = query.sortType || 'desc';
    const orderBy = { [orderField]: orderType };
    const result = await paginate<
      AdditionalReward,
      Prisma.AdditionalRewardFindManyArgs
    >(this.prisma.additionalReward, {
      where: {
        ...(query.projectId && { projectId: query.projectId }),
        OR: query?.search
          ? [
              {
                project: {
                  name: { contains: query.search, mode: 'insensitive' },
                },
              },
            ]
          : undefined,
      },
      orderBy,
      select: {
        id: true,
        amount: true,
        endDateClaim: true,
        startDateClaim: true,
        contactAddress: true,
        project: {
          select: {
            id: true,
            name: true,
            ticker: true,
            contractAddress: true,
            decimals: true,
            chains: {
              select: {
                chain: {
                  select: {
                    id: true,
                    urlScanner: true,
                  },
                },
              },
            },
          },
        },
        type: {
          select: {
            name: true,
          },
        },
      },
    });
    return result;
  }
  private async noPagination(query: QueryParamDto) {
    const orderField = query.sortBy || 'createdAt';
    const orderType = query.sortType || 'desc';
    const orderBy = { [orderField]: orderType };
    return this.prisma.additionalReward.findMany({
      where: {
        ...(query.projectId && { projectId: query.projectId }),
        OR: query?.search
          ? [
              {
                project: {
                  name: { contains: query.search, mode: 'insensitive' },
                },
              },
            ]
          : undefined,
      },
      orderBy,
      select: {
        id: true,
        amount: true,
        endDateClaim: true,
        startDateClaim: true,
        contactAddress: true,
        project: {
          select: {
            id: true,
            name: true,
            ticker: true,
            contractAddress: true,
            decimals: true,
            chains: {
              select: {
                chain: {
                  select: {
                    id: true,
                    urlScanner: true,
                  },
                },
              },
            },
          },
        },
        type: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  // async findEligibleAirdrop(query: QueryParamDto, userId: string) {
  //   const now = new Date();
  //   const rewards = await this.prisma.userAdditionalReward.findMany({
  //     where: {
  //       userId: userId,
  //       isClaimed: false,
  //       additionalReward: {
  //         endDateClaim: {
  //           gte: now,
  //         },
  //         startDateClaim: {
  //           lte: now,
  //         },
  //       },
  //     },
  //     include: {
  //       additionalReward: {
  //         include: {
  //           project: {
  //             select: {
  //               id: true,
  //               name: true,
  //               ticker: true,
  //               contractAddress: true,
  //               decimals: true,
  //               chains: {
  //                 select: {
  //                   chain: {
  //                     select: {
  //                       id: true,
  //                       urlScanner: true,
  //                     },
  //                   },
  //                 },
  //               },
  //             },
  //           },
  //           type: {
  //             select: {
  //               name: true,
  //             },
  //           },
  //         },
  //       },
  //     },
  //   });
  //   return rewards;
  // }
  async findEligibleAirdrop(query: QueryParamDto, userId: string) {
    const now = new Date();
    const userAdditionalRewards =
      await this.prisma.userAdditionalReward.findMany({
        where: {
          userId: userId,
          isClaimed: false,
        },
        select: {
          additionalRewardId: true,
        },
      });
    const projects = await this.prisma.project.findMany({
      where: {
        additionalReward: {
          some: {
            id: {
              in: userAdditionalRewards.map(
                (reward) => reward.additionalRewardId,
              ),
            },
            startDateClaim: { lte: now },
            endDateClaim: { gte: now },
          },
        },
        OR: query?.search
          ? [
              {
                name: { contains: query.search, mode: 'insensitive' },
              },
            ]
          : undefined,
      },
      select: {
        id: true,
        name: true,
        ticker: true,
        contractAddress: true,
        decimals: true,
        banner: true,
        logo: true,
        chains: {
          select: {
            chain: {
              select: {
                id: true,
                urlScanner: true,
                chainid: true,
                name: true,
              },
            },
          },
        },
        additionalReward: {
          where: {
            id: {
              in: userAdditionalRewards.map(
                (reward) => reward.additionalRewardId,
              ),
            },
            startDateClaim: { lte: now },
            endDateClaim: { gte: now },
          },
          select: {
            id: true,
            amount: true,
            startDateClaim: true,
            endDateClaim: true,
            contactAddress: true,
            type: {
              select: {
                name: true,
              },
            },
            userAdditionalReward: {
              where: {
                userId: userId,
                isClaimed: false,
              },
              select: {
                id: true,
                address: true,
                amount: true,
                isClaimed: true,
              },
            },
          },
        },
      },
    });

    const newProjects = projects.map((item) => {
      return {
        id: item.id,
        name: item.name,
        ticker: item.ticker,
        contractAddress: item.contractAddress,
        decimals: item.decimals,
        banner: item.banner,
        logo: item.logo,
        chains: item.chains,
        airdrop: item.additionalReward.map((item) => {
          const itemAirdrop = item.userAdditionalReward[0];
          return {
            ...itemAirdrop,
            amount: Number(itemAirdrop?.amount || 0),
          };
        }),
        totalEligible: item.additionalReward.reduce((a, b) => {
          return a + Number(b.userAdditionalReward[0]?.amount || 0);
        }, 0),
      };
    });

    return newProjects;
  }
}
