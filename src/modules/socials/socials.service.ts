import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSocialDto } from './dto/create-social.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { QueryParamDto } from 'src/common/pagination/dto/pagination.dto';
import { parseBoolean } from 'src/common/utils/parse-data-type';
import { UpdateSocialDto } from './dto/update-social.dto';
import { createPaginator } from 'prisma-pagination';
import { Prisma, Social } from '@prisma/client';

@Injectable()
export class SocialsService {
  constructor(private readonly prisma: PrismaService) {}
  create(data: CreateSocialDto) {
    return this.prisma.social.create({ data });
  }

  async findMany(query: QueryParamDto) {
    if (parseBoolean(query.noPaginate)) {
      return this.noPagination(query);
    }
    return this.withPagination(query);
  }

  async findOne(id: string) {
    const result = await this.prisma.social.findUnique({
      where: { id },
    });
    if (!result) {
      throw new NotFoundException(`data with ${id} not found!`);
    }
    return result;
  }

  async update(id: string, data: UpdateSocialDto) {
    await this.findOne(id);
    return this.prisma.social.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.social.delete({ where: { id } });
  }

  private async withPagination(query: QueryParamDto) {
    const paginate = createPaginator({
      page: query.page,
      perPage: query.pageSize,
    });
    const orderField = query.sortBy || 'createdAt';
    const orderType = query.sortType || 'desc';
    const orderBy = { [orderField]: orderType };
    const result = await paginate<Social, Prisma.SocialFindManyArgs>(
      this.prisma.social,
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
          icon: true,
        },
      },
    );
    return result;
  }
  private async noPagination(query: QueryParamDto) {
    const orderField = query.sortBy || 'createdAt';
    const orderType = query.sortType || 'desc';
    const orderBy = { [orderField]: orderType };
    return this.prisma.social.findMany({
      where: {
        OR: query?.search
          ? [{ name: { contains: query.search, mode: 'insensitive' } }]
          : undefined,
      },
      orderBy,
      select: {
        id: true,
        name: true,
        icon: true,
      },
    });
  }
}
