import { ChianType, PrismaClient } from '@prisma/client';
import { chains } from '../../data/chain';

const prisma = new PrismaClient();
export async function createChains() {
  const data = chains.map((item) => {
    return {
      ...item,
      type: item.type as ChianType,
    };
  });
  return prisma.chain.createMany({
    data: data,
  });
}
