import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { createPaginator } from 'prisma-pagination';
import { QueryParamDto } from 'src/common/pagination/dto/pagination.dto';
import { hashPassword } from 'src/common/password';
import { parseBoolean } from 'src/common/utils/parse-data-type';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateMemberDto } from './dto/update-member.dto';
import {
  CreateMemberByAdminDto,
  SignCategoryDto,
  SignTypeDto,
} from './dto/create-member.dto';

@Injectable()
export class MembersService {
  constructor(private prisma: PrismaService) {}
  async create(createUserDto: CreateMemberByAdminDto) {
    return this.prisma.user.create({
      data: {
        ...createUserDto,
        password: await hashPassword(process.env.DEFAULT_PASSWORD),
      },
    });
  }

  async findMany(query: QueryParamDto) {
    if (query.type === 'PUBLIC' || query.type === 'PROJECT_OWNER') {
      return this.withPagination(query);
    }
    throw new BadRequestException('define type PUBLIC or PROJECT_OWNER');
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        fullname: true,
        email: true,
        status: true,
        category: true,
        type: true,
        walletAddress: true,
        roles: {
          select: {
            role: {
              select: {
                id: true,
                name: true,
                code: true,
              },
            },
          },
        },
      },
    });
    let data;
    const { verification } = await this.findUserVerification(id);
    if (verification) {
      data = await this.prisma.projectOwnerVerification.findUnique({
        where: {
          userId_verificationId: {
            userId: user.id,
            verificationId: verification.id,
          },
        },
        select: {
          idCard: true,
          selfie: true,
          bisnisLicense: true,
          taxId: true,
          submittedAt: true,
          approvedAt: true,
          status: true,
          rejectionReason: true,
          rejectedAt: true,
          logs: {
            orderBy: {
              createdAt: 'desc',
            },
            select: {
              id: true,
              status: true,
              note: true,
              createdAt: true,
              createdBy: true,
            },
          },
          // user: {
          //   select: {
          //     id: true,
          //     fullname: true,
          //     email: true,
          //     status: true,
          //     category: true,
          //     type: true,
          //     walletAddress: true,
          //   },
          // },
          // verification: {
          //   select: {
          //     id: true,
          //     name: true,
          //     type: true,
          //   },
          // },
        },
      });
    }
    return {
      ...user,
      verification: data,
    };
    // return users;
  }

  async update(id: string, body: UpdateMemberDto) {
    await this.checkDataById(id);
    return this.prisma.user.update({
      where: { id },
      data: {
        fullname: body.fullname,
        status: body.status,
      },
      select: {
        id: true,
      },
    });
  }
  async signCategory(body: SignCategoryDto) {
    await this.checkDataById(body.userId);
    return this.prisma.user.update({
      where: {
        id: body.userId,
      },
      data: { category: body.category },
      select: { id: true },
    });
  }
  async signType(body: SignTypeDto) {
    await this.checkDataById(body.userId);
    return this.prisma.user.update({
      where: {
        id: body.userId,
      },
      data: { type: body.type },
      select: { id: true },
    });
  }

  async isEmailUsed(email: string, id: string) {
    const result = await this.prisma.user.findFirst({
      where: { email },
      select: {
        id: true,
        email: true,
      },
    });
    if (result && result.id !== id) {
      throw new ConflictException('email has been used');
    }
    return result;
  }
  async checkDataById(id: string) {
    const r = await this.prisma.user.findUnique({
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
    const result = await paginate<User, Prisma.UserFindManyArgs>(
      this.prisma.user,
      {
        where: {
          status: parseBoolean(query?.status),
          type: query?.type,
          ...(query?.search && {
            OR: [
              { fullname: { contains: query.search, mode: 'insensitive' } },
              { email: { contains: query.search, mode: 'insensitive' } },
            ],
          }),
        },
        orderBy,
        select: {
          id: true,
          fullname: true,
          email: true,
          status: true,
          type: true,
          category: true,
          walletAddress: true,
          verifications: {
            orderBy: { createdAt: 'desc' },
            take: 1,
            select: {
              status: true,
            },
          },
          roles: {
            select: {
              id: true,
              role: {
                select: {
                  id: true,
                  name: true,
                  code: true,
                },
              },
            },
          },
        },
      },
    );
    return result;
  }
  private async findUserVerification(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        fullname: true,
        email: true,
        status: true,
        category: true,
        type: true,
        walletAddress: true,
      },
    });
    if (!user) {
      throw new NotFoundException('user not found!');
    }
    const verification = await this.prisma.verification.findFirst({
      where: { type: user.category },
      orderBy: { createdAt: 'desc' },
    });
    return { verification };
  }
}
