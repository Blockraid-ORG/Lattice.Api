import { Injectable } from '@nestjs/common';
import { Presales, Prisma } from '@prisma/client';
// import { add } from 'date-fns';
import { createPaginator } from 'prisma-pagination';
import { QueryParamDto } from 'src/common/pagination/dto/pagination.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateClaimPresaleDto,
  GetClaimPresaleDto,
} from '../client/presale/dto/create-presale.dto';
import {
  ActivateNewPresaleDto,
  AddProjectAddressWhitelistDto,
  CreateNewPresaleDto,
  CreatePresaleDto,
  FindMyContributeDto,
} from './dto/create-presale.dto';
import { UpdateNewPresaleDto } from './dto/update-presale.dto';

@Injectable()
export class PresalesService {
  constructor(private readonly prisma: PrismaService) {}
  create(dto: CreatePresaleDto, userId: string) {
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
  async findAll(query: QueryParamDto) {
    const paginate = createPaginator({
      page: query.page,
      perPage: query.pageSize,
    });
    const orderField = query.sortBy || 'createdAt';
    const orderType = query.sortType || 'desc';
    const orderBy = { [orderField]: orderType };
    const result = await paginate<Presales, Prisma.PresalesFindManyArgs>(
      this.prisma.presales,
      {
        where: {
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
          project: {
            select: {
              id: true,
              name: true,
              logo: true,
              banner: true,
              ticker: true,
              totalSupply: true,
              decimals: true,
              contractAddress: true,
              chains: {
                select: {
                  chain: true,
                },
              },
              socials: {
                include: {
                  social: true,
                },
              },
              allocations: true,
            },
          },
          projectId: true,
          chainId: true,
          hardcap: true,
          price: true,
          maxContribution: true,
          startDate: true,
          endDate: true,
          duration: true,
          claimTime: true,
          unit: true,
          contractAddress: true,
          whitelistContract: true,
          whitelistDuration: true,
          sweepDuration: true,
        },
      },
    );
    return result;
  }
  async findAllMyPresale(query: QueryParamDto, userId: string) {
    const paginate = createPaginator({
      page: query.page,
      perPage: query.pageSize,
    });
    const orderField = query.sortBy || 'createdAt';
    const orderType = query.sortType || 'desc';
    const orderBy = { [orderField]: orderType };
    const result = await paginate<Presales, Prisma.PresalesFindManyArgs>(
      this.prisma.presales,
      {
        where: {
          project: {
            userId,
          },
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
          project: {
            select: {
              id: true,
              name: true,
              logo: true,
              banner: true,
              ticker: true,
              totalSupply: true,
              decimals: true,
              contractAddress: true,
              chains: {
                select: {
                  chain: true,
                },
              },
              socials: {
                include: {
                  social: true,
                },
              },
              allocations: true,
            },
          },
          projectId: true,
          chainId: true,
          hardcap: true,
          price: true,
          maxContribution: true,
          startDate: true,
          endDate: true,
          duration: true,
          claimTime: true,
          unit: true,
          contractAddress: true,
          whitelistContract: true,
          whitelistDuration: true,
          sweepDuration: true,
        },
      },
    );
    return result;
  }

  async findAllActivePresale(query: QueryParamDto) {
    const now = new Date();
    const paginate = createPaginator({
      page: query.page,
      perPage: query.pageSize,
    });
    const orderField = query.sortBy || 'createdAt';
    const orderType = query.sortType || 'desc';
    const orderBy = { [orderField]: orderType };
    const result = await paginate<Presales, Prisma.PresalesFindManyArgs>(
      this.prisma.presales,
      {
        where: {
          startDate: { lte: now },
          endDate: { gte: now },
          project: {
            ...(query.categoryId && { categoryId: query.categoryId }),
            status: 'DEPLOYED',
          },
        },
        orderBy,
        select: {
          id: true,
          project: {
            select: {
              id: true,
              name: true,
              logo: true,
              banner: true,
              ticker: true,
              totalSupply: true,
              decimals: true,
              contractAddress: true,
              detail: true,
              projectType: {
                select: {
                  id: true,
                  name: true,
                },
              },
              category: {
                select: {
                  id: true,
                  name: true,
                },
              },
              chains: {
                select: {
                  chain: true,
                },
              },
              socials: {
                include: {
                  social: true,
                },
              },
              allocations: true,
            },
          },
          projectId: true,
          chainId: true,
          hardcap: true,
          price: true,
          maxContribution: true,
          startDate: true,
          endDate: true,
          duration: true,
          claimTime: true,
          unit: true,
          contractAddress: true,
          whitelistContract: true,
          whitelistDuration: true,
          sweepDuration: true,
        },
      },
    );
    return result;
  }
  async findAllUpcomingPresale(query: QueryParamDto) {
    const now = new Date();
    const paginate = createPaginator({
      page: query.page,
      perPage: query.pageSize,
    });
    const orderField = query.sortBy || 'createdAt';
    const orderType = query.sortType || 'desc';
    const orderBy = { [orderField]: orderType };
    const result = await paginate<Presales, Prisma.PresalesFindManyArgs>(
      this.prisma.presales,
      {
        where: {
          startDate: { gte: now },
          project: {
            status: 'APPROVED',
          },
        },
        orderBy,
        select: {
          id: true,
          project: {
            select: {
              id: true,
              name: true,
              logo: true,
              banner: true,
              ticker: true,
              totalSupply: true,
              decimals: true,
              contractAddress: true,
              chains: {
                select: {
                  chain: true,
                },
              },
              socials: {
                include: {
                  social: true,
                },
              },
              allocations: true,
            },
          },
          projectId: true,
          chainId: true,
          hardcap: true,
          price: true,
          maxContribution: true,
          startDate: true,
          endDate: true,
          duration: true,
          claimTime: true,
          unit: true,
          contractAddress: true,
          whitelistContract: true,
          whitelistDuration: true,
          sweepDuration: true,
        },
      },
    );
    return result;
  }
  async findOne(id: string) {
    return this.prisma.presales.findUnique({
      where: {
        id: id,
      },
      include: {
        project: {
          include: {
            allocations: true,
            category: {
              select: {
                id: true,
                name: true,
                description: true,
              },
            },
            chains: {
              select: {
                chain: {
                  select: {
                    id: true,
                    name: true,
                    ticker: true,
                    logo: true,
                    urlScanner: true,
                    type: true,
                  },
                },
              },
            },
          },
        },
        trasactions: {
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

  async createClaimPresale(dto: CreateClaimPresaleDto, userId: string) {
    return this.prisma.presaleClaimedToken.create({
      data: {
        presaleId: dto.presaleId,
        amount: dto.amount,
        transactionHash: dto.transactionHash,
        userId: userId,
      },
    });
  }

  async getMyClaimPresale(dto: GetClaimPresaleDto, userId: string) {
    return this.prisma.presaleClaimedToken.findMany({
      where: {
        presaleId: dto.presaleId,
        userId: userId,
      },
    });
  }

  // Manage Presale
  async createNewPresale(dto: CreateNewPresaleDto) {
    const project = await this.prisma.project.findUnique({
      where: { id: dto.projectId },
      include: {
        chains: true,
      },
    });
    const initialPresale = await this.prisma.presales.findFirst({
      where: {
        projectId: project.id,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return this.prisma.presales.create({
      data: {
        projectId: dto.projectId,
        chainId: project.chains[0].chainId,
        hardcap: dto.hardcap,
        price: dto.price,
        maxContribution: dto.maxContribution,
        unit: initialPresale.unit || dto.unit,
        claimTime: dto.claimTime,
        contractAddress: dto.contractAddress,
        duration: dto.duration,
        startDate: dto.startDate,
        endDate: dto.endDate,
        // endDate: add(new Date(dto.startDate), { days: dto.duration }),
        presaleSCID: dto.presaleSCID,
        sweepDuration: initialPresale.sweepDuration || dto.sweepDuration,
        whitelistDuration:
          initialPresale.whitelistDuration || dto.whitelistDuration,
      },
    });
  }

  deletePresale(id: string) {
    return this.prisma.presales.delete({
      where: { id },
    });
  }
  updatePresale(id: string, data: UpdateNewPresaleDto) {
    // const duration = data.duration;
    return this.prisma.presales.update({
      where: { id },
      data: {
        ...data,
        // endDate: duration && add(new Date(data.startDate), { days: duration }),
      },
    });
  }
  activatePresale(data: ActivateNewPresaleDto) {
    return this.prisma.presales.update({
      where: { id: data.id },
      data: {
        presaleSCID: Number(data.presaleSCID),
      },
    });
  }
  async addProjectPresaleWhitelistAddress(
    data: AddProjectAddressWhitelistDto[],
  ) {
    return this.prisma.projectPresaleWhitelistAddress.createMany({
      data: data,
    });
  }
  async removeProjectPresaleWhitelistAddress(dto: string[]) {
    return this.prisma.projectPresaleWhitelistAddress.deleteMany({
      where: {
        id: {
          in: dto,
        },
      },
    });
  }
  async setWdPresale(id: string) {
    return this.prisma.presales.update({
      where: { id: id },
      data: {
        isWithdrawn: true,
      },
    });
  }
}
