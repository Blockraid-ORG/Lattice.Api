import { PrismaClient } from '@prisma/client';
import { permissionData } from '../../data/permissions';
const prisma = new PrismaClient();
export async function createPermissions() {
  return prisma.permission.createMany({
    data: permissionData,
  });
}
