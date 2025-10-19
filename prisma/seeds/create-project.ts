import { PrismaClient, ProjectStatus } from '@prisma/client';

const prisma = new PrismaClient();
export async function createProject() {
  const category = await prisma.category.findFirst({
    select: { id: true },
  });
  const dataChain = await prisma.chain.findFirst({
    select: { id: true },
  });
  const dataSocials = await prisma.social.findMany({
    select: { id: true },
  });
  const user = await prisma.user.findFirst({
    select: { id: true },
  });
  if (category.id && dataChain && dataSocials && user) {
    const project = {
      name: 'SporeVC',
      slug: 'SPV',
      logo: 'uploads/file-1751695686112-426978417.png',
      banner: 'uploads/file-1751695686112-426978417.png',
      ticker: 'MPR',
      decimals: 18,
      totalSupply: '1000',
      detail: 'This is a project description.',
      status: 'PENDING' as ProjectStatus,
      category: {
        connect: { id: category.id },
      },
      user: {
        connect: { id: user.id },
      },
      chainIds: [dataChain.id],
      allocations: [
        {
          name: 'PRESALE',
          supply: 100,
          vesting: 6,
          startDate: '2025-07-01T00:00:00Z',
          isPresale: true,
        },
        {
          name: 'TEAM',
          supply: 100,
          vesting: 1,
          startDate: '2025-07-01T00:00:00Z',
          isPresale: false,
        },
        {
          name: 'PUBLIC',
          supply: 800,
          vesting: 1,
          startDate: '2025-07-01T00:00:00Z',
          isPresale: false,
        },
      ],
      socials: dataSocials.map((item) => {
        return {
          socialId: item.id,
          url: 'https://google.com',
        };
      }),
      presales: {
        chainId: dataChain.id,
        hardcap: '10',
        price: '0.05',
        maxContribution: '10',
        duration: 1,
        unit: 'USDT',
      },
    };
    const { chainIds, allocations, socials, presales, ...projectData } =
      project;
    return prisma.project.create({
      data: {
        ...projectData,
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
        presales: presales
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
        presales: true,
      },
    });
  }
}
