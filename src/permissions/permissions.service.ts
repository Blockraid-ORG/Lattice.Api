import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { QueryParamDto } from 'src/common/pagination/dto/pagination.dto';
import { createPaginator } from 'prisma-pagination';
import { Permission, Prisma } from '@prisma/client';
import { parseBoolean } from 'src/common/utils/parse-data-type';

@Injectable()
export class PermissionsService {
  constructor(private readonly prisma: PrismaService) {}
  create(dto: CreatePermissionDto) {
    return this.prisma.permission.create({
      data: dto,
    });
  }
  async findMany(query: QueryParamDto) {
    if (parseBoolean(query.noPaginate)) {
      return this.noPagination(query);
    }
    return this.withPagination(query);
  }

  findOne(id: string) {
    return this.prisma.permission.findUnique({ where: { id } });
  }

  async update(id: string, body: UpdatePermissionDto) {
    await this.checkDataById(id);
    return this.prisma.permission.update({
      where: { id },
      data: {
        name: body.name,
        code: body.code,
        path: body.path,
      },
      select: {
        id: true,
      },
    });
  }

  async remove(id: string) {
    await this.checkDataById(id);
    return this.prisma.permission.delete({
      where: {
        id,
      },
    });
  }

  async checkDataById(id: string) {
    const r = await this.prisma.permission.findUnique({
      where: {
        id: id,
      },
      select: { id: true },
    });
    if (!r) {
      throw new NotFoundException();
    }
    return r;
  }
  private async withPagination(query: QueryParamDto) {
    const paginate = createPaginator({
      page: query.page,
      perPage: query.pageSize,
    });
    const orderField = query.sortBy || 'createdAt';
    const orderType = query.sortType || 'desc';
    const orderBy = { [orderField]: orderType };
    const result = await paginate<Permission, Prisma.PermissionFindManyArgs>(
      this.prisma.permission,
      {
        where: {
          OR: query?.search
            ? [
                { name: { contains: query.search, mode: 'insensitive' } },
                { code: { contains: query.search, mode: 'insensitive' } },
                { method: { contains: query.search, mode: 'insensitive' } },
              ]
            : undefined,
        },
        orderBy,
        select: {
          id: true,
          name: true,
          code: true,
          path: true,
          method: true,
        },
      },
    );

    return result;
  }
  private async noPagination(query: QueryParamDto) {
    const orderField = query.sortBy || 'createdAt';
    const orderType = query.sortType || 'desc';
    const orderBy = { [orderField]: orderType };
    return this.prisma.permission.findMany({
      where: {
        OR: query?.search
          ? [
              { name: { contains: query.search, mode: 'insensitive' } },
              { code: { contains: query.search, mode: 'insensitive' } },
              { method: { contains: query.search, mode: 'insensitive' } },
            ]
          : undefined,
      },
      orderBy,
      select: {
        id: true,
        name: true,
        code: true,
        path: true,
        method: true,
      },
    });
  }
}
