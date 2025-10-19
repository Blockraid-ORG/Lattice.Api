import { PrismaClient } from '@prisma/client';
import { projectTypeData } from '../../data/project-type';
const prisma = new PrismaClient();
export async function createProjectType() {
  const data = projectTypeData.map((item) => {
    return item;
  });
  return prisma.projectType.createMany({
    data: data,
  });
}
