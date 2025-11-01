import { Injectable } from '@nestjs/common';
import { UserSession } from 'src/auth/dto/auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StatsService {
  constructor(private readonly prisma: PrismaService) {}
  async countAsset(user: UserSession) {
    const projectTypes = await this.prisma.projectType.findMany({
      select: { name: true, icon: true },
    });

    const transactions = await this.prisma.transactionPresales.findMany({
      where: { userId: user.id },
      select: {
        project: {
          select: {
            id: true,
            projectType: {
              select: { name: true },
            },
          },
        },
      },
    });

    const grouped = transactions.reduce(
      (acc, tx) => {
        const type = tx.project?.projectType?.name ?? 'UNKNOWN';
        if (!acc[type]) acc[type] = new Set<string>();
        acc[type].add(tx.project.id);
        return acc;
      },
      {} as Record<string, Set<string>>,
    );

    const result = projectTypes.map((pt) => ({
      projectType: pt.name,
      icon: pt.icon,
      projectCount: grouped[pt.name]?.size ?? 0,
    }));
    const totalCount = result.reduce((sum, r) => sum + r.projectCount, 0);

    return {
      total: totalCount,
      items: result,
    };
  }
  async listAsset(user: UserSession) {
    const projects = await this.prisma.project.findMany({
      where: {
        transactionPresales: {
          some: { userId: user.id },
        },
      },
      select: {
        id: true,
        name: true,
        ticker: true,
        decimals: true,
        totalSupply: true,
        contractAddress: true,
        logo: true,
        banner: true,
        category: {
          select: {
            name: true,
            icon: true,
          },
        },
        projectType: {
          select: {
            id: true,
            name: true,
          },
        },
        presales: {
          where: {
            trasactions: {
              some: { userId: user.id },
            },
          },
          select: {
            id: true,
            unit: true,
            presaleSCID: true,
            trasactions: {
              where: { userId: user.id },
              select: {
                id: true,
                price: true,
                count: true,
              },
            },
          },
        },
      },
    });
    const result = projects.map((project) => ({
      ...project,
      presales: project.presales.map((presale) => {
        const totalCount = presale.trasactions.reduce(
          (sum, tx) => sum + Number(tx.count),
          0,
        );
        return {
          ...presale,
          totalCount,
        };
      }),
    }));

    return result;
  }
}
