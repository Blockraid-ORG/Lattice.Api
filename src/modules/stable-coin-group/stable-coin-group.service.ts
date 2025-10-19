import { Injectable } from '@nestjs/common';
import { CreateStableCoinGroupDto } from './dto/create-stable-coin-group.dto';
import { UpdateStableCoinGroupDto } from './dto/update-stable-coin-group.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { QueryParamDto } from 'src/common/pagination/dto/pagination.dto';
import { createPaginator } from 'prisma-pagination';
import { Prisma, StableCoinGroup } from '@prisma/client';
import { parseBoolean } from 'src/common/utils/parse-data-type';

@Injectable()
export class StableCoinGroupService {
  constructor(private readonly prisma: PrismaService) {}
  create(dto: CreateStableCoinGroupDto) {
    return this.prisma.stableCoinGroup.create({
      data: dto,
    });
  }

  async findAll(query: QueryParamDto) {
    if (parseBoolean(query.noPaginate)) {
      return this.noPagination(query);
    }
    return this.withPagination(query);
  }

  findOne(id: string) {
    return this.prisma.stableCoinGroup.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        mStableCoin: {
          select: {
            id: true,
            address: true,
            chain: true,
            decimal: true,
          },
        },
      },
    });
  }

  update(id: string, dto: UpdateStableCoinGroupDto) {
    return this.prisma.stableCoinGroup.update({
      data: dto,
      where: { id },
    });
  }

  remove(id: string) {
    return this.prisma.stableCoinGroup.deleteMany({
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
    const result = await paginate<
      StableCoinGroup,
      Prisma.StableCoinGroupFindManyArgs
    >(this.prisma.stableCoinGroup, {
      where: {
        OR: query?.search
          ? [{ name: { contains: query.search, mode: 'insensitive' } }]
          : undefined,
      },
      orderBy,
      select: {
        id: true,
        name: true,
      },
    });
    return result;
  }
  private async noPagination(query: QueryParamDto) {
    const orderField = query.sortBy || 'createdAt';
    const orderType = query.sortType || 'desc';
    const orderBy = { [orderField]: orderType };
    return this.prisma.stableCoinGroup.findMany({
      where: {
        OR: query?.search
          ? [{ name: { contains: query.search, mode: 'insensitive' } }]
          : undefined,
      },
      orderBy,
      select: {
        id: true,
        name: true,
      },
    });
  }
}
