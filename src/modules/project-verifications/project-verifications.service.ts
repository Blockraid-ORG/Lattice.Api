import { Injectable } from '@nestjs/common';
import { CreateProjectVerificationDto } from './dto/create-project-verification.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { QueryParamDto } from 'src/common/pagination/dto/pagination.dto';
import { createPaginator } from 'prisma-pagination';
import {
  EnumVerificationStatus,
  Prisma,
  ProjectReviewLog,
} from '@prisma/client';

@Injectable()
export class ProjectVerificationsService {
  constructor(private readonly prisma: PrismaService) {}
  async create(dto: CreateProjectVerificationDto) {
    console.log({ dto });
    const projectItem = await this.prisma.project.findUnique({
      where: {
        id: dto.projectId,
      },
      select: {
        id: true,
        status: true,
        contractAddress: true,
      },
    });
    if (projectItem.status === dto.status) {
      return projectItem;
    }
    return this.prisma.$transaction(async (tx) => {
      await tx.projectReviewLog.create({
        data: {
          status: dto.status,
          note: dto.note,
          projectId: dto.projectId,
        },
      });
      const updatedProject = await tx.project.update({
        where: {
          id: dto.projectId,
        },
        data: {
          status: dto.status,
          contractAddress: dto.contractAddress,
          factoryAddress: dto.factoryAddress,
          presaleAddress: dto.presaleAddress,
          whitelistsAddress: dto.whitelistsAddress,
        },
        select: {
          id: true,
          status: true,
        },
      });
      return updatedProject;
    });
  }

  async findMany(query: QueryParamDto) {
    const paginate = createPaginator({
      page: query.page,
      perPage: query.pageSize,
    });
    const orderField = query.sortBy || 'createdAt';
    const orderType = query.sortType || 'desc';
    const orderBy = { [orderField]: orderType };
    const result = await paginate<
      ProjectReviewLog,
      Prisma.ProjectReviewLogFindManyArgs
    >(this.prisma.projectReviewLog, {
      where: {
        ...(query.projectId && { projectId: query.projectId }),
        ...(query.status && { status: query.status as EnumVerificationStatus }),
        OR: query?.search
          ? [{ note: { contains: query.search, mode: 'insensitive' } }]
          : undefined,
      },
      orderBy,
      select: {
        id: true,
        status: true,
        note: true,
        project: {
          select: {
            id: true,
            status: true,
            name: true,
          },
        },
      },
    });
    return result;
  }

  findOne(id: string) {
    return this.prisma.projectReviewLog.findUnique({
      where: { id },
      include: {
        project: {
          select: {
            id: true,
            status: true,
            name: true,
          },
        },
      },
    });
  }
}
