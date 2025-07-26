import { ConflictException, Injectable } from '@nestjs/common';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}
  async findMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        fullname: true,
        email: true,
        password: true,
        status: true,
        category: true,
        type: true,
        walletAddress: true,
        verifications: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });
    const vRequirement = await this.prisma.verification.findFirst({
      where: {
        type: user.category,
      },
      select: {
        SelfieRequired: true,
        IDCardRequired: true,
        BussinessLicenseRequired: true,
        TaxIdRequired: true,
      },
    });
    const logs = await this.prisma.reviewVerificationLog.findMany({
      where: {
        projectOwnerVerificationUserId: user.id,
      },
      orderBy: { createdAt: 'desc' },
      select: {
        status: true,
        createdAt: true,
        note: true,
        id: true,
      },
    });
    return {
      ...user,
      lastVerification:
        user.verifications.length > 0 ? user.verifications[0].status : null,
      vRequirement,
      verificationLogs: logs,
    };
  }
  async update(dto: UpdateProfileDto, userId: string) {
    if (dto.email) {
      await this.checkIsEmailUsed(dto.email, userId);
    }
    return this.prisma.user.update({
      where: { id: userId },
      data: dto,
    });
  }
  private async checkIsEmailUsed(email: string, userId: string) {
    const currentUser = await this.prisma.user.findFirst({
      where: {
        email: email,
      },
    });
    if (!currentUser) return true;
    if (currentUser.id === userId) return true;
    throw new ConflictException('Email has been registered!');
  }
}
