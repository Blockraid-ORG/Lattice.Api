import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project-dto';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}
  async create(dto: CreateProjectDto, userId: string) {
    const { chainIds, allocations, socials, presales, ...projectData } = dto;
    return this.prisma.project.create({
      data: {
        ...projectData,
        userId,
        // Relations
        chains: {
          create: chainIds.map((chainId) => ({
            chain: { connect: { id: chainId } },
          })),
        },

        allocations: {
          create: allocations.map((a) => ({
            ...a,
          })),
        },

        socials: {
          create: socials.map((s) => ({
            url: s.url,
            social: { connect: { id: s.socialId } },
          })),
        },

        Presales: presales
          ? {
              create: {
                ...presales,
              },
            }
          : undefined,
      },
      include: {
        chains: { include: { chain: true } },
        allocations: true,
        socials: { include: { social: true } },
        Presales: true,
      },
    });
  }
}
