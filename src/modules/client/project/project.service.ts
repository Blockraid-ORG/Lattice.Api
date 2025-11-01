import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Project, ProjectAllocation } from '@prisma/client';
import { createPaginator } from 'prisma-pagination';
import { UserSession } from 'src/auth/dto/auth.dto';
import { QueryParamDto } from 'src/common/pagination/dto/pagination.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProjectService {
  constructor(private readonly prisma: PrismaService) {}
  findMany(query: QueryParamDto) {
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
            whitelistDuration: true,
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
          },
        },
        additionalReward: {
          select: {
            id: true,
            amount: true,
            type: {
              select: {
                id: true,
                name: true,
              },
            },
            startDateClaim: true,
            endDateClaim: true,
            contactAddress: true,
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
          // ...(query.status && { status: query.status }),
          status: 'DEPLOYED',
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

  async findMyVesting(query: QueryParamDto, user: UserSession) {
    const currentUser = await this.prisma.user.findUnique({
      where: { id: user.userId },
    });
    const paginate = createPaginator({
      page: query.page,
      perPage: query.pageSize,
    });
    console.log(currentUser.walletAddress);
    const orderField = query.sortBy || 'createdAt';
    const orderType = query.sortType || 'desc';
    const orderBy = { [orderField]: orderType };
    const result = await paginate<
      ProjectAllocation,
      Prisma.ProjectAllocationFindManyArgs
    >(this.prisma.projectAllocation, {
      where: {
        addresses: {
          some: {
            address: {
              equals: currentUser.walletAddress,
              mode: 'insensitive',
            },
            deletedAt: null,
          },
        },
        project: { status: 'DEPLOYED' },
      },
      orderBy,
      include: {
        addresses: {
          where: {
            address: currentUser.walletAddress,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
            logo: true,
            ticker: true,
            decimals: true,
            contractAddress: true,
            chains: {
              select: {
                chain: {
                  select: {
                    id: true,
                    name: true,
                    logo: true,
                    type: true,
                    urlScanner: true,
                    chainid: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    return result;
  }
}
