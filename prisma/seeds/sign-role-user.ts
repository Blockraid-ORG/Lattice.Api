import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export async function signRoleUser() {
  const superUser = await prisma.user.findFirst({
    where: {
      fullname: 'Super User',
    },
    select: { id: true },
  });
  const role = await prisma.role.findFirst({
    where: {
      name: 'SUPER',
    },
    select: { id: true },
  });
  return prisma.userRole.create({
    data: {
      roleId: role.id,
      userId: superUser.id,
    },
  });
}
