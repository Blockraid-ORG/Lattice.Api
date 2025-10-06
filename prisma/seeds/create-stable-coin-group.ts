import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export async function createStableCoinGroup() {
  return prisma.stableCoinGroup.create({
    data: {
      name: 'USDC',
    },
  });
}
