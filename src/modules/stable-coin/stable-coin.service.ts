import { Injectable } from '@nestjs/common';
import { QueryParamDto } from 'src/common/pagination/dto/pagination.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateStableCoinDto } from './dto/create-stable-coin.dto';
import { UpdateStableCoinDto } from './dto/update-stable-coin.dto';
import { createPaginator } from 'prisma-pagination';
import { MStableCoin, Prisma } from '@prisma/client';
import { parseBoolean } from 'src/common/utils/parse-data-type';

@Injectable()
export class StableCoinService {
  constructor(private readonly prisma: PrismaService) {}
  create(dto: CreateStableCoinDto) {
    return this.prisma.mStableCoin.create({ data: dto });
  }

  findAll(query: QueryParamDto) {
    if (parseBoolean(query.noPaginate)) {
      return this.noPagination(query);
    }
    return this.withPagination(query);
  }

  findOne(id: string) {
    return this.prisma.mStableCoin.findUnique({
      where: { id },
      select: {
        id: true,
        address: true,
        decimal: true,
        chain: {
          select: {
            id: true,
            name: true,
            ticker: true,
            urlScanner: true,
            logo: true,
          },
        },
        stableCoin: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  update(id: string, dto: UpdateStableCoinDto) {
    return this.prisma.mStableCoin.update({
      data: dto,
      where: { id },
    });
  }

  remove(id: string) {
    return this.prisma.mStableCoin.deleteMany({
      where: { id },
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
    const result = await paginate<MStableCoin, Prisma.MStableCoinFindManyArgs>(
      this.prisma.mStableCoin,
      {
        where: {
          OR: query?.search
            ? [
                {
                  stableCoin: {
                    name: { contains: query.search, mode: 'insensitive' },
                  },
                },
              ]
            : undefined,
        },
        orderBy,
        select: {
          id: true,
          address: true,
          decimal: true,
          chain: {
            select: {
              id: true,
              name: true,
              ticker: true,
              urlScanner: true,
              logo: true,
            },
          },
          stableCoin: {
            select: {
              id: true,
              name: true,
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
    return this.prisma.mStableCoin.findMany({
      where: {
        OR: query?.search
          ? [
              {
                stableCoin: {
                  name: { contains: query.search, mode: 'insensitive' },
                },
              },
            ]
          : undefined,
      },
      orderBy,
      select: {
        id: true,
        address: true,
        decimal: true,
        chain: {
          select: {
            id: true,
            name: true,
            ticker: true,
            urlScanner: true,
            logo: true,
          },
        },
        stableCoin: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }
}
