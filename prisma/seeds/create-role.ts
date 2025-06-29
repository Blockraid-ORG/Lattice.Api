import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function createRole() {
  return await prisma.role.create({
    data: {
      name: 'SUPER',
      code: 'SUPER',
    },
  });
}
