import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAdditionalRewardTypeDto } from './dto/create-additional-reward-type.dto';
import { UpdateAdditionalRewardTypeDto } from './dto/update-additional-reward-type.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { parseBoolean } from 'src/common/utils/parse-data-type';
import { QueryParamDto } from 'src/common/pagination/dto/pagination.dto';
import { createPaginator } from 'prisma-pagination';
import { AdditionalRewardType, Prisma } from '@prisma/client';

@Injectable()
export class AdditionalRewardTypesService {
  constructor(private readonly prisma: PrismaService) {}
  create(dto: CreateAdditionalRewardTypeDto) {
    return this.prisma.additionalRewardType.create({
      data: dto,
    });
  }

  async findMany(query: QueryParamDto) {
    if (parseBoolean(query.noPaginate)) {
      return this.noPagination(query);
    }
    return this.withPagination(query);
  }

  async findOne(id: string) {
    const result = await this.prisma.additionalRewardType.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        status: true,
        rewards: true,
      },
    });
    if (!result) {
      throw new NotFoundException(`data with ${id} not found!`);
    }
    return result;
  }

  async update(id: string, data: UpdateAdditionalRewardTypeDto) {
    await this.findOne(id);
    return this.prisma.additionalRewardType.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.additionalRewardType.delete({ where: { id } });
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
      AdditionalRewardType,
      Prisma.AdditionalRewardTypeFindManyArgs
    >(this.prisma.additionalRewardType, {
      where: {
        OR: query?.search
          ? [{ name: { contains: query.search, mode: 'insensitive' } }]
          : undefined,
      },
      orderBy,
      select: {
        id: true,
        name: true,
        status: true,
        rewards: true,
      },
    });
    return result;
  }
  private async noPagination(query: QueryParamDto) {
    const orderField = query.sortBy || 'createdAt';
    const orderType = query.sortType || 'desc';
    const orderBy = { [orderField]: orderType };
    return this.prisma.additionalRewardType.findMany({
      where: {
        OR: query?.search
          ? [{ name: { contains: query.search, mode: 'insensitive' } }]
          : undefined,
      },
      orderBy,
      select: {
        id: true,
        name: true,
        status: true,
      },
    });
  }
}
