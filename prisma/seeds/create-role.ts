import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function createRole() {
  return await prisma.role.createMany({
    data: [
      {
        name: 'SUPER',
        code: 'SUPER',
      },
      {
        name: 'ADMIN',
        code: 'ADMIN',
      },
      {
        name: 'USER',
        code: 'USER',
      },
    ],
  });
}
