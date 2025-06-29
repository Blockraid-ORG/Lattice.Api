import { FrequencyCategory, PrismaClient } from '@prisma/client';
import { categoryData } from '../../data/category';
const prisma = new PrismaClient();
export async function createCategory() {
  const data = categoryData.map((item) => {
    return {
      ...item,
      frequency: item.frequency as FrequencyCategory,
    };
  });
  return prisma.category.createMany({
    data: data,
  });
}
