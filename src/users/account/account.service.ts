import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { BindAcccountDto } from './dto/create-user.dto';

@Injectable()
export class AccountService {
  constructor(private prisma: PrismaService) {}
  async getMyAccount(userId: string, appCode: string) {
    const result = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        fullname: true,
        category: true,
        type: true,
        walletAddress: true,
        email: true,
        clientApp: {
          select: {
            id: true,
            code: true,
            name: true,
            description: true,
          },
        },
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
    const isUserRegisteredOnApp = appCode === result.clientApp?.code;
    if (isUserRegisteredOnApp) {
      return {
        accountStatus: 'REGISTERED',
        message: `Account Registered On ${result.clientApp.name}`,
        account: result,
      };
    }
    return {
      accountStatus: 'UNREGISTERED',
      message: `Account Unregistered On ${result.clientApp.name}`,
      account: result,
    };
  }
  async bindAccount(dto: BindAcccountDto, userId: string, appCode: string) {
    const x = await this.checkIsUserBindApp(dto, appCode);
    return x;
  }
  async checkIsUserBindApp(dto: BindAcccountDto, appCode: string) {
    const x = await this.prisma.user.findFirst({
      where: {
        email: dto.email,
        clientApp: {
          code: appCode,
        },
      },
    });
    return x;
  }
}
