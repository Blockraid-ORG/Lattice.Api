import { PrismaClient } from '@prisma/client';
import { rewardTypeData } from '../../data/reward-type';

const prisma = new PrismaClient();
export async function createRewardType() {
  return prisma.additionalRewardType.createMany({
    data: rewardTypeData,
  });
}
