import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMasterVerificationDto } from './dto/create-master-verification.dto';
import { UpdateMasterVerificationDto } from './dto/update-master-verification.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { parseBoolean } from 'src/common/utils/parse-data-type';
import { QueryParamDto } from 'src/common/pagination/dto/pagination.dto';
import { createPaginator } from 'prisma-pagination';
import { Prisma, Verification } from '@prisma/client';

@Injectable()
export class VerificationsService {
  constructor(private readonly prisma: PrismaService) {}
  create(data: CreateMasterVerificationDto) {
    return this.prisma.verification.create({ data });
  }
  async findMany(query: QueryParamDto) {
    if (parseBoolean(query.noPaginate)) {
      return this.noPagination(query);
    }
    return this.withPagination(query);
  }

  async findOne(id: string) {
    const result = await this.prisma.verification.findUnique({
      where: { id },
    });
    if (!result) {
      throw new NotFoundException(`data with ${id} not found!`);
    }
    return result;
  }

  async update(id: string, data: UpdateMasterVerificationDto) {
    await this.findOne(id);
    return this.prisma.verification.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.verification.delete({ where: { id } });
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
      Verification,
      Prisma.VerificationFindManyArgs
    >(this.prisma.verification, {
      where: {
        OR: query?.search
          ? [{ name: { contains: query.search, mode: 'insensitive' } }]
          : undefined,
      },
      orderBy,
      select: {
        id: true,
        name: true,
        type: true,
        IDCardRequired: true,
        SelfieRequired: true,
        BussinessLicenseRequired: true,
        TaxIdRequired: true,
      },
    });
    return result;
  }
  private async noPagination(query: QueryParamDto) {
    const orderField = query.sortBy || 'createdAt';
    const orderType = query.sortType || 'desc';
    const orderBy = { [orderField]: orderType };
    return this.prisma.verification.findMany({
      where: {
        OR: query?.search
          ? [{ name: { contains: query.search, mode: 'insensitive' } }]
          : undefined,
      },
      orderBy,
      select: {
        id: true,
        name: true,
        type: true,
        IDCardRequired: true,
        SelfieRequired: true,
        BussinessLicenseRequired: true,
        TaxIdRequired: true,
      },
    });
  }
}
