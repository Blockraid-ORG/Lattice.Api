import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { OperationUserPointDto } from './dto/create-client-user-point.dto';
import { createPaginator } from 'prisma-pagination';
import { QueryParamDto } from 'src/common/pagination/dto/pagination.dto';
import { ClientUserPointHistory, Prisma } from '@prisma/client';

@Injectable()
export class ClientUserPointService {
  constructor(private readonly prisma: PrismaService) {}
  getMyPoint(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        point: {
          select: {
            id: true,
            balance: true,
          },
        },
      },
    });
  }
  async getMyHistoryPoint(query: QueryParamDto, userId: string) {
    const paginate = createPaginator({
      page: query.page,
      perPage: query.pageSize,
    });
    const orderField = query.sortBy || 'createdAt';
    const orderType = query.sortType || 'desc';
    const orderBy = { [orderField]: orderType };

    const userPoint = await this.prisma.clientUserPoint.findUnique({
      where: { userId },
      select: { id: true },
    });
    const result = await paginate<
      ClientUserPointHistory,
      Prisma.ClientUserPointHistoryFindManyArgs
    >(this.prisma.clientUserPointHistory, {
      where: {
        pointId: userPoint.id,
      },
      orderBy,
      select: {
        id: true,
        change: true,
        type: true,
        description: true,
        balanceBefore: true,
        balanceAfter: true,
        createdAt: true,
      },
    });

    return result;
  }
  async addPoint(dto: OperationUserPointDto, userId: string) {
    // cek apakah sudah ada row point
    const result = await this.prisma.$transaction(async (tx) => {
      const point = await tx.clientUserPoint.findUnique({
        where: { userId },
      });
      const before = point?.balance ?? 0;
      const after = before + dto.amount;
      // update saldo
      const updated = await tx.clientUserPoint.upsert({
        where: { userId },
        update: { balance: after },
        create: {
          userId,
          balance: after,
        },
      });
      await tx.clientUserPointHistory.create({
        data: {
          pointId: updated.id,
          change: dto.amount,
          type: 'IN',
          description: 'Add Balance By User',
          balanceBefore: before,
          balanceAfter: after,
        },
      });
      return updated;
    });
    return result;
  }

  async claimPoint(dto: OperationUserPointDto, userId: string) {
    const result = this.prisma.$transaction(async (tx) => {
      const point = await tx.clientUserPoint.findUnique({
        where: { userId },
      });

      if (!point) throw new NotFoundException('User point not found');

      if (point.balance < dto.amount) {
        throw new NotFoundException('Insufficient balance');
      }

      const before = point.balance;
      const after = before - dto.amount;

      // update saldo
      const updated = await tx.clientUserPoint.update({
        where: { userId },
        data: { balance: after },
      });

      // insert history
      await tx.clientUserPointHistory.create({
        data: {
          pointId: point.id,
          change: -dto.amount,
          type: 'OUT',
          description: 'Claim Point By User',
          balanceBefore: before,
          balanceAfter: after,
        },
      });

      return updated;
    });

    return result;
  }

  async decreasePoint(dto: OperationUserPointDto, userId: string) {
    const result = this.prisma.$transaction(async (tx) => {
      const point = await tx.clientUserPoint.findUnique({
        where: { userId },
      });

      if (!point) throw new NotFoundException('Point Not Found');

      const before = point.balance;
      const after = before - dto.amount;

      // update saldo
      const updated = await tx.clientUserPoint.update({
        where: { userId },
        data: { balance: after },
      });

      // insert history
      await tx.clientUserPointHistory.create({
        data: {
          pointId: point.id,
          change: -dto.amount,
          type: 'DEDUCT',
          description: 'Decrease Point By Admin',
          balanceBefore: before,
          balanceAfter: after,
        },
      });

      return updated;
    });

    return result;
  }
  async increasePoint(dto: OperationUserPointDto, userId: string) {
    // cek apakah sudah ada row point
    const result = await this.prisma.$transaction(async (tx) => {
      const point = await tx.clientUserPoint.findUnique({
        where: { userId },
      });
      const before = point?.balance ?? 0;
      const after = before + dto.amount;
      // update saldo
      const updated = await tx.clientUserPoint.upsert({
        where: { userId },
        update: { balance: after },
        create: {
          userId,
          balance: after,
        },
      });
      await tx.clientUserPointHistory.create({
        data: {
          pointId: updated.id,
          change: dto.amount,
          type: 'IN',
          description: 'Increase Balance By Admin',
          balanceBefore: before,
          balanceAfter: after,
        },
      });
      return updated;
    });
    return result;
  }
}
