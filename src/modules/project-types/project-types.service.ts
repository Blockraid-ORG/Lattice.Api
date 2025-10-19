import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectTypeDto } from './dto/create-project-type.dto';
import { UpdateProjectTypeDto } from './dto/update-project-type.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { QueryParamDto } from 'src/common/pagination/dto/pagination.dto';
import { Prisma, ProjectType } from '@prisma/client';
import { createPaginator } from 'prisma-pagination';
import { parseBoolean } from 'src/common/utils/parse-data-type';

@Injectable()
export class ProjectTypesService {
  constructor(private readonly prisma: PrismaService) {}
  create(dto: CreateProjectTypeDto) {
    return this.prisma.projectType.create({
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
    const result = await this.prisma.projectType.findUnique({
      where: { id },
      include: {
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    if (!result) {
      throw new NotFoundException(`data with ${id} not found!`);
    }
    return result;
  }

  async update(id: string, data: UpdateProjectTypeDto) {
    await this.findOne(id);
    return this.prisma.projectType.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.projectType.delete({ where: { id } });
  }
  private async withPagination(query: QueryParamDto) {
    const paginate = createPaginator({
      page: query.page,
      perPage: query.pageSize,
    });
    const orderField = query.sortBy || 'createdAt';
    const orderType = query.sortType || 'desc';
    const orderBy = { [orderField]: orderType };
    const result = await paginate<ProjectType, Prisma.ProjectTypeFindManyArgs>(
      this.prisma.projectType,
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
          description: true,
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
    return this.prisma.projectType.findMany({
      where: {
        OR: query?.search
          ? [{ name: { contains: query.search, mode: 'insensitive' } }]
          : undefined,
      },
      orderBy,
      select: {
        id: true,
        name: true,
        description: true,
        icon: true,
      },
    });
  }
}
