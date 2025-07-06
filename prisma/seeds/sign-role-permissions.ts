import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export async function signRolePermission() {
  const permissions = await prisma.permission.findMany({
    select: { id: true },
  });
  const role = await prisma.role.findFirst({
    where: { name: 'SUPER' },
    select: { id: true },
  });
  const dataRolePermission = permissions.map((permission) => {
    return {
      permissionId: permission.id,
      roleId: role.id,
    };
  });
  return prisma.rolePermission.createMany({
    data: dataRolePermission,
  });
}
