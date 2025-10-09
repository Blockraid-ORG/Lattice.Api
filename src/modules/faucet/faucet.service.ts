import { Injectable, Query } from '@nestjs/common';
import { FaucetHistory, Prisma } from '@prisma/client';
import { createPaginator } from 'prisma-pagination';
import { QueryParamDto } from 'src/common/pagination/dto/pagination.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFaucetDto } from './dto/create-faucet.dto';

@Injectable()
export class FaucetService {
  constructor(private readonly prisma: PrismaService) {}
  create(dto: CreateFaucetDto, userId: string) {
    return this.prisma.faucetHistory.create({
      data: {
        address: dto.address,
        amount: dto.amount,
        unit: dto.unit,
        userId,
      },
    });
  }

  findMany(@Query() query: QueryParamDto) {
    return this.withPagination(query);
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
      FaucetHistory,
      Prisma.FaucetHistoryFindManyArgs
    >(this.prisma.faucetHistory, {
      where: {
        ...(query.status && { status: query.status }),
        ...(query.userId && { userId: query.userId }),
        ...(query.categoryId && { categoryId: query.categoryId }),
      },
      orderBy,
      include: {
        user: {
          select: {
            id: true,
            walletAddress: true,
          },
        },
      },
    });
    return result;
  }
}
