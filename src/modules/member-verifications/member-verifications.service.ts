import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  ApproveMemberVerificationDto,
  CreateMemberVerificationDto,
  RejectMemberVerificationDto,
} from './dto/create-member-verification.dto';
import { UpdateMemberVerificationDto } from './dto/update-member-verification.dto';

@Injectable()
export class MemberVerificationsService {
  constructor(private prisma: PrismaService) {}
  async create(dto: CreateMemberVerificationDto) {
    const { user, verification } = await this.findUserVerification(dto.userId);
    if (verification?.IDCardRequired && !dto.idCard) {
      throw new BadRequestException(
        `ID Card is required (KTP | SIM | PASSPORT)`,
      );
    }
    if (verification?.SelfieRequired && !dto.selfie) {
      throw new BadRequestException(`selfie is required`);
    }
    if (verification?.BussinessLicenseRequired && !dto.bisnisLicense) {
      throw new BadRequestException(`Bisnis License is required (NIB | NPWP)`);
    }
    if (verification?.TaxIdRequired && !dto.taxId) {
      throw new BadRequestException(`Tax ID is required (NIB | NPWP)`);
    }
    const [projectOwnerVerification, verificationLog] =
      await this.prisma.$transaction([
        this.prisma.projectOwnerVerification.create({
          data: {
            ...dto,
            verificationId: verification.id,
            submittedAt: new Date(),
          },
        }),
        this.prisma.reviewVerificationLog.create({
          data: {
            status: 'PENDING',
            note: 'Create By User',
            createdBy: user.id,
            projectOwnerVerificationUserId: user.id,
            projectOwnerVerificationVerificationId: verification.id,
          },
        }),
      ]);
    return {
      projectOwnerVerification,
      verificationLog,
    };
  }

  async findByUser(userId: string) {
    const { user, verification } = await this.findUserVerification(userId);
    return this.prisma.projectOwnerVerification.findUnique({
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
        user: {
          select: {
            id: true,
            fullname: true,
            email: true,
            status: true,
            category: true,
            type: true,
            walletAddress: true,
          },
        },
        verification: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
      },
    });
  }

  async revision(dto: UpdateMemberVerificationDto) {
    const { user, verification } = await this.findUserVerification(dto.userId);
    if (verification.IDCardRequired && !dto.idCard) {
      throw new BadRequestException(
        `ID Card is required (KTP | SIM | PASSPORT)`,
      );
    }
    if (verification.SelfieRequired && !dto.selfie) {
      throw new BadRequestException(`selfie is required`);
    }
    if (verification.BussinessLicenseRequired && !dto.bisnisLicense) {
      throw new BadRequestException(`Bisnis License is required (NIB | NPWP)`);
    }
    if (verification.TaxIdRequired && !dto.taxId) {
      throw new BadRequestException(`Tax ID is required (NIB | NPWP)`);
    }
    const [projectOwnerVerification, verificationLog] =
      await this.prisma.$transaction([
        this.prisma.projectOwnerVerification.update({
          where: {
            userId_verificationId: {
              userId: user.id,
              verificationId: verification.id,
            },
          },
          data: {
            ...dto,
            verificationId: verification.id,
          },
        }),
        this.prisma.reviewVerificationLog.create({
          data: {
            status: 'PENDING',
            note: 'Change By User',
            projectOwnerVerificationUserId: user.id,
            projectOwnerVerificationVerificationId: verification.id,
          },
        }),
      ]);
    return {
      projectOwnerVerification,
      verificationLog,
    };
  }

  private async findUserVerification(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        fullname: true,
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
    return { user, verification };
  }

  async reject(dto: RejectMemberVerificationDto) {
    const { user, verification } = await this.findUserVerification(dto.userId);
    const [projectOwnerVerification, verificationLog] =
      await this.prisma.$transaction([
        this.prisma.projectOwnerVerification.update({
          where: {
            userId_verificationId: {
              userId: user.id,
              verificationId: verification.id,
            },
          },
          data: {
            status: 'REJECTED',
            rejectionReason: dto.rejectionReason,
            rejectedAt: new Date(),
          },
        }),
        this.prisma.reviewVerificationLog.create({
          data: {
            status: 'REJECTED',
            note: dto.rejectionReason,
            projectOwnerVerificationUserId: user.id,
            projectOwnerVerificationVerificationId: verification.id,
          },
        }),
      ]);
    return {
      projectOwnerVerification,
      verificationLog,
    };
  }
  async approve(dto: ApproveMemberVerificationDto) {
    const { user, verification } = await this.findUserVerification(dto.userId);
    const [projectOwnerVerification, verificationLog] =
      await this.prisma.$transaction([
        this.prisma.projectOwnerVerification.update({
          where: {
            userId_verificationId: {
              userId: user.id,
              verificationId: verification.id,
            },
          },
          data: {
            status: 'APPROVED',
            approvedAt: new Date(),
          },
        }),
        this.prisma.reviewVerificationLog.create({
          data: {
            status: 'APPROVED',
            note: 'OK',
            projectOwnerVerificationUserId: user.id,
            projectOwnerVerificationVerificationId: verification.id,
          },
        }),
      ]);
    return {
      projectOwnerVerification,
      verificationLog,
    };
  }
}
