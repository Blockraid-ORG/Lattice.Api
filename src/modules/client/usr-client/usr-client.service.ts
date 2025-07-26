import { Injectable } from '@nestjs/common';
import { FindSummaryProjectDto } from './dto/usr-client.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsrClientService {
  constructor(private prisma: PrismaService) {}
  async countSummaryProject(query: FindSummaryProjectDto, userId: string) {
    const ALL_STATUSES = [
      'PENDING',
      'APPROVED',
      'REJECTED',
      'DEPLOYED',
    ] as const;

    const countProjects = await this.prisma.project.groupBy({
      by: ['status'],
      where: {
        userId: userId,
      },
      _count: {
        _all: true,
      },
    });

    const resultMap = Object.fromEntries(
      countProjects.map((item) => [item.status, item._count._all]),
    );

    const formattedResult = ALL_STATUSES.map((status) => ({
      status,
      count: resultMap[status] ?? 0,
    }));
    return formattedResult;
  }
}
