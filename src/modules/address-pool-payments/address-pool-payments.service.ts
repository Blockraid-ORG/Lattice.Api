import { Injectable } from '@nestjs/common';
import { CreateAddressPoolPaymentDto } from './dto/create-address-pool-payment.dto';
import { UpdateAddressPoolPaymentDto } from './dto/update-address-pool-payment.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { createPaginator } from 'prisma-pagination';
import { QueryParamDto } from 'src/common/pagination/dto/pagination.dto';
import { AddressPoolPayment, Prisma } from '@prisma/client';
import { parseBoolean } from 'src/common/utils/parse-data-type';

@Injectable()
export class AddressPoolPaymentsService {
  constructor(private readonly prisma: PrismaService) {}
  create(dto: CreateAddressPoolPaymentDto) {
    return this.prisma.addressPoolPayment.create({
      data: dto,
    });
  }

  findAll(query: QueryParamDto) {
    if (parseBoolean(query.noPaginate)) {
      return this.noPagination(query);
    }
    return this.withPagination(query);
  }

  findOne(id: string) {
    return this.prisma.addressPoolPayment.findUnique({
      where: { id },
    });
  }

  update(id: string, dto: UpdateAddressPoolPaymentDto) {
    return this.prisma.addressPoolPayment.update({
      where: { id },
      data: dto,
    });
  }

  remove(id: string) {
    return this.prisma.addressPoolPayment.delete({
      where: { id },
    });
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
      AddressPoolPayment,
      Prisma.AddressPoolPaymentFindManyArgs
    >(this.prisma.addressPoolPayment, {
      where: {
        OR: query?.search
          ? [
              {
                stableCoin: {
                  address: { contains: query.search, mode: 'insensitive' },
                },
              },
            ]
          : undefined,
      },
      orderBy,
      select: {
        id: true,
        paymentSc: true,
        listingFee: true,
        presaleFee: true,
        decimal: true,
        status: true,
        stableCoin: {
          select: {
            id: true,
            address: true,
            chain: {
              select: {
                id: true,
                name: true,
                ticker: true,
              },
            },
            stableCoin: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
    return result;
  }
  private async noPagination(query: QueryParamDto) {
    const orderField = query.sortBy || 'createdAt';
    const orderType = query.sortType || 'desc';
    const orderBy = { [orderField]: orderType };
    return this.prisma.addressPoolPayment.findMany({
      where: {
        status: true,
        AND: [
          query?.stableCoinGroupId
            ? { stableCoin: { stableCoinGroupId: query.stableCoinGroupId } }
            : {},
          query?.chainId ? { stableCoin: { chainId: query.chainId } } : {},
        ],
      },
      orderBy,
      select: {
        id: true,
        paymentSc: true,
        listingFee: true,
        presaleFee: true,
        decimal: true,
        status: true,
        stableCoin: {
          select: {
            id: true,
            address: true,
            chain: {
              select: {
                id: true,
                name: true,
                ticker: true,
              },
            },
            stableCoin: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
  }

  // extra
  async getByStableAndChain(query: QueryParamDto) {
    // const stableGroup = await this.prisma.stableCoinGroup.findFirst({
    //   where: {
    //     name: query.group,
    //   },
    //   select: { id: true },
    // });
    const result = await this.prisma.addressPoolPayment.findFirst({
      where: {
        status: true,
        AND: [
          // { stableCoin: { stableCoinGroupId: stableGroup.id } },
          { stableCoin: { chainId: query.chainId } },
        ],
      },
      select: {
        id: true,
        paymentSc: true,
        listingFee: true,
        presaleFee: true,
        decimal: true,
        status: true,
        stableCoin: {
          select: {
            id: true,
            address: true,
            chain: {
              select: {
                id: true,
                name: true,
                ticker: true,
              },
            },
            stableCoin: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
    return result;
  }
}
