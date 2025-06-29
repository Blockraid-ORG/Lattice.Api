import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Project } from '@prisma/client';
import { createPaginator } from 'prisma-pagination';
import { QueryParamDto } from 'src/common/pagination/dto/pagination.dto';
import { parseBoolean } from 'src/common/utils/parse-data-type';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProjectDto, UpdateProjectDto } from './dto/create-project-dto';
@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}
  async create(dto: CreateProjectDto, userId: string) {
    const { chainIds, allocations, socials, presales, ...projectData } = dto;
    return this.prisma.project.create({
      data: {
        ...projectData,
        userId,
        // Relations
        chains: {
          create: chainIds.map((chainId) => ({
            chain: { connect: { id: chainId } },
          })),
        },

        allocations: {
          create: allocations.map((a) => ({
            ...a,
          })),
        },

        socials: {
          create: socials.map((s) => ({
            url: s.url,
            social: { connect: { id: s.socialId } },
          })),
        },

        Presales: presales
          ? {
              create: {
                ...presales,
              },
            }
          : undefined,
      },
      include: {
        chains: { include: { chain: true } },
        allocations: true,
        socials: { include: { social: true } },
        Presales: true,
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
              },
            },
          },
        },
        allocations: {
          select: {
            id: true,
            name: true,
            supply: true,
            vesting: true,
            startDate: true,
            isPresale: true,
          },
        },
        transactionPresales: {
          select: {
            id: true,
            users: {
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
    if (!result) {
      throw new NotFoundException(`data with ${id} not found!`);
    }
    return result;
  }
  // TODO: update

  // Action Extra
  async updateReviewProject(dto: UpdateProjectDto) {
    return dto;
  }
  // Action Extra

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
    });
  }
}
