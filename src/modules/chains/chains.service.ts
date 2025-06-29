import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateChainDto } from './dto/create-chain.dto';
import { UpdateChainDto } from './dto/update-chain.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Chain, Prisma } from '@prisma/client';
import { createPaginator } from 'prisma-pagination';
import { QueryParamDto } from 'src/common/pagination/dto/pagination.dto';
import { parseBoolean } from 'src/common/utils/parse-data-type';

@Injectable()
export class ChainsService {
  constructor(private readonly prisma: PrismaService) {}
  create(data: CreateChainDto) {
    return this.prisma.chain.create({ data });
  }

  async findMany(query: QueryParamDto) {
    if (parseBoolean(query.noPaginate)) {
      return this.noPagination(query);
    }
    return this.withPagination(query);
  }

  async findOne(id: string) {
    const result = await this.prisma.chain.findUnique({
      where: { id },
    });
    if (!result) {
      throw new NotFoundException(`data with ${id} not found!`);
    }
    return result;
  }

  async update(id: string, data: UpdateChainDto) {
    await this.findOne(id);
    return this.prisma.chain.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.chain.delete({ where: { id } });
  }

  private async withPagination(query: QueryParamDto) {
    const paginate = createPaginator({
      page: query.page,
      perPage: query.pageSize,
    });
    const orderField = query.sortBy || 'type';
    const orderType = query.sortType || 'asc';
    const orderBy = { [orderField]: orderType };
    const result = await paginate<Chain, Prisma.ChainFindManyArgs>(
      this.prisma.chain,
      {
        where: {
          OR: query?.search
            ? [{ name: { contains: query.search, mode: 'insensitive' } }]
            : undefined,
        },
        orderBy,
        select: {
          id: true,
          name: true,
          logo: true,
          ticker: true,
          type: true,
          urlScanner: true,
        },
      },
    );
    return result;
  }
  private async noPagination(query: QueryParamDto) {
    const orderField = query.sortBy || 'createdAt';
    const orderType = query.sortType || 'desc';
    const orderBy = { [orderField]: orderType };
    return this.prisma.chain.findMany({
      where: {
        OR: query?.search
          ? [{ name: { contains: query.search, mode: 'insensitive' } }]
          : undefined,
      },
      orderBy,
      select: {
        id: true,
        name: true,
        logo: true,
      },
    });
  }
}
