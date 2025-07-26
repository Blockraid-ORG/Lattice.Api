import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export async function signRolePublicPermission() {
  const permissions = await prisma.permission.findMany({
    select: { id: true },
    where: {
      code: {
        in: [
          'GET_chains',
          'GET_socials',
          'GET_categories',
          'GET_master-verifications',
          'POST_projects',
          'POST_projects/me',
          'GET_projects/:id',
          'PATCH_projects/:id',
          'POST_project-verifications',
          'GET_project-verifications',
          'GET_project-verifications/:id',
        ],
      },
    },
  });
  const role = await prisma.role.findFirst({
    where: { name: 'USER' },
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
