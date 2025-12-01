import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateClientAppDto } from './dto/create-client-app.dto';
import { UpdateClientAppDto } from './dto/update-client-app.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { QueryParamDto } from 'src/common/pagination/dto/pagination.dto';
import { parseBoolean } from 'src/common/utils/parse-data-type';
import { createPaginator } from 'prisma-pagination';
import { ClientApp, Prisma } from '@prisma/client';

@Injectable()
export class ClientAppsService {
  constructor(private readonly prisma: PrismaService) {}
  create(dto: CreateClientAppDto) {
    return this.prisma.clientApp.create({
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
    const result = await this.prisma.clientApp.findUnique({
      where: { id },
    });
    if (!result) {
      throw new NotFoundException(`data with ${id} not found!`);
    }
    return result;
  }

  async update(id: string, data: UpdateClientAppDto) {
    await this.findOne(id);
    return this.prisma.clientApp.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.clientApp.delete({ where: { id } });
  }
  private async withPagination(query: QueryParamDto) {
    const paginate = createPaginator({
      page: query.page,
      perPage: query.pageSize,
    });
    const orderField = query.sortBy || 'createdAt';
    const orderType = query.sortType || 'desc';
    const orderBy = { [orderField]: orderType };
    const result = await paginate<ClientApp, Prisma.ClientAppFindManyArgs>(
      this.prisma.clientApp,
      {
        where: {
          OR: query?.search
            ? [
                { name: { contains: query.search, mode: 'insensitive' } },
                { code: { contains: query.search, mode: 'insensitive' } },
              ]
            : undefined,
        },
        orderBy,
        select: {
          id: true,
          code: true,
          name: true,
          url: true,
          description: true,
        },
      },
    );
    return result;
  }
  private async noPagination(query: QueryParamDto) {
    const orderField = query.sortBy || 'createdAt';
    const orderType = query.sortType || 'desc';
    const orderBy = { [orderField]: orderType };
    return this.prisma.clientApp.findMany({
      where: {
        OR: query?.search
          ? [{ name: { contains: query.search, mode: 'insensitive' } }]
          : undefined,
      },
      select: {
        id: true,
        code: true,
        name: true,
        url: true,
        description: true,
      },
      orderBy,
    });
  }
}
