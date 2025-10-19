import { Injectable } from '@nestjs/common';
import { FindSummaryProjectDto } from './dto/usr-client.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { QueryParamDto } from 'src/common/pagination/dto/pagination.dto';
import { parseBoolean } from 'src/common/utils/parse-data-type';
import { createPaginator } from 'prisma-pagination';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class UsrClientService {
  constructor(private prisma: PrismaService) {}
  async countSummaryProject(query: FindSummaryProjectDto, userId: string) {
    const ALL_STATUSES = [
      'PENDING',
      'APPROVED',
      'REJECTED',
      'DEPLOYED',
    ] as const;

    const countProjects = await this.prisma.project.groupBy({
      by: ['status'],
      where: {
        userId: userId,
      },
      _count: {
        _all: true,
      },
    });

    const resultMap = Object.fromEntries(
      countProjects.map((item) => [item.status, item._count._all]),
    );

    const formattedResult = ALL_STATUSES.map((status) => ({
      status,
      count: resultMap[status] ?? 0,
    }));
    return formattedResult;
  }
  async findUserVerified(query: QueryParamDto) {
    if (parseBoolean(query.noPaginate)) {
      return this.noPagination(query);
    }
    return this.withPagination(query);
  }

  private async withPagination(query: QueryParamDto) {
    const paginate = createPaginator({
      page: query.page,
      perPage: query.pageSize,
    });
    const orderField = query.sortBy || 'createdAt';
    const orderType = query.sortType || 'desc';
    const orderBy = { [orderField]: orderType };
    const result = await paginate<User, Prisma.UserFindManyArgs>(
      this.prisma.user,
      {
        where: {
          status: true,
          walletAddress: {
            not: null,
          },
          roles: {
            some: {
              role: {
                name: 'USER',
              },
            },
          },
          OR: query?.search
            ? [
                {
                  walletAddress: {
                    contains: query.search,
                    mode: 'insensitive',
                  },
                },
              ]
            : undefined,
        },
        orderBy,
        select: {
          id: true,
          fullname: true,
          email: true,
          status: true,
          walletAddress: true,
        },
      },
    );
    return result;
  }
  private async noPagination(query: QueryParamDto) {
    const orderField = query.sortBy || 'createdAt';
    const orderType = query.sortType || 'desc';
    const orderBy = { [orderField]: orderType };
    return this.prisma.user.findMany({
      where: {
        status: true,
        walletAddress: {
          not: null,
        },
        roles: {
          some: {
            role: {
              name: 'USER',
            },
          },
        },
        OR: query?.search
          ? [{ walletAddress: { contains: query.search, mode: 'insensitive' } }]
          : undefined,
      },
      orderBy,
      select: {
        id: true,
        fullname: true,
        email: true,
        status: true,
        walletAddress: true,
      },
    });
  }
}
