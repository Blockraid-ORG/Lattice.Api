import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Project } from '@prisma/client';
import { createPaginator } from 'prisma-pagination';
import { QueryParamDto } from 'src/common/pagination/dto/pagination.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  AddWhitelistDto,
  CreatePresaleDto,
  CreateTransactionPresaleDto,
} from './dto/create-presale.dto';
import { FindMyContributeDto } from './dto/find-presale.dto';

@Injectable()
export class PresaleService {
  constructor(private readonly prisma: PrismaService) {}
  create(dto: CreatePresaleDto) {
    return dto;
  }

  async findMany(query: QueryParamDto) {
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
        presaleAddress: true,
        rewardContractAddress: true,
        whitelistsAddress: true,
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
          },
        },
        presales: {
          where: {
            isActive: true,
          },
          orderBy: {
            presaleSCID: 'desc',
          },
          // take: 1,
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
            presaleSCID: true,
            isActive: true,
            whitelists: {
              select: {
                id: true,
                walletAddress: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            fullname: true,
            walletAddress: true,
          },
        },
      },
    });
    if (!result) {
      throw new NotFoundException(`data with ${id} not found!`);
    }
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
          ...(query.categoryId && { categoryId: query.categoryId }),
          status: 'DEPLOYED',
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
          category: {
            select: {
              id: true,
              name: true,
              icon: true,
            },
          },
          presales: {
            select: {
              id: true,
              projectId: true,
              chainId: true,
              hardcap: true,
              price: true,
              maxContribution: true,
              startDate: true,
              duration: true,
              claimTime: true,
              unit: true,
              contractAddress: true,
              whitelistContract: true,
              whitelistDuration: true,
              sweepDuration: true,
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
          chains: {
            select: {
              chain: {
                select: {
                  id: true,
                  name: true,
                  logo: true,
                  type: true,
                },
              },
            },
          },
        },
      },
    );
    return result;
  }

  // Extra
  async addWhitelist(dto: AddWhitelistDto) {
    const data = dto.walletAddress.map((item) => {
      return {
        presaleId: dto.presaleId,
        walletAddress: item,
      };
    });
    const result = await this.prisma.$transaction(async (tx) => {
      const deletedAddress = await tx.presaleAddressWhitelist.deleteMany({
        where: {
          presaleId: dto.presaleId,
        },
      });
      const createdAddress = await tx.presaleAddressWhitelist.createMany({
        data: data,
      });
      return { deletedAddress, createdAddress };
    });
    return result;
  }

  async findActivePresale(query: QueryParamDto) {
    const paginate = createPaginator({
      page: query.page,
      perPage: query.pageSize,
    });
    const result = await paginate<Project, Prisma.ProjectFindManyArgs>(
      this.prisma.project,
      {
        where: {
          status: 'DEPLOYED',
          presales: {
            some: {
              isActive: true,
            },
          },
        },
        orderBy: {
          updatedAt: 'desc',
        },
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
          category: {
            select: {
              id: true,
              name: true,
              icon: true,
            },
          },
          presales: {
            where: {
              isActive: true,
            },
            orderBy: {
              presaleSCID: 'desc',
            },
            select: {
              id: true,
              projectId: true,
              chainId: true,
              hardcap: true,
              price: true,
              maxContribution: true,
              startDate: true,
              duration: true,
              claimTime: true,
              unit: true,
              contractAddress: true,
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
          chains: {
            select: {
              chain: {
                select: {
                  id: true,
                  name: true,
                  logo: true,
                  type: true,
                },
              },
            },
          },
        },
      },
    );
    return result;
  }
  createContributePresale(dto: CreateTransactionPresaleDto, userId: string) {
    return this.prisma.transactionPresales.create({
      data: {
        presaleId: dto.presaleId,
        price: dto.price,
        projectId: dto.projectId,
        count: dto.count,
        userId,
        transactionHash: dto.transactionHash,
      },
    });
  }
  async getMyContribution(query: FindMyContributeDto, userId: string) {
    return this.prisma.transactionPresales.findMany({
      where: {
        presaleId: query.presaleId,
        projectId: query.projectId,
        userId,
      },
      include: {
        presale: true,
        project: {
          select: {
            chains: {
              select: {
                chain: true,
              },
            },
          },
        },
      },
    });
  }
}
