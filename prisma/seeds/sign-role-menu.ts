import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export async function signRoleMenu() {
  const menus = await prisma.menu.findMany({
    select: { id: true },
  });
  const role = await prisma.role.findFirst({
    where: { name: 'SUPER' },
    select: { id: true },
  });
  const dataRoleMenu = menus.map((menu) => {
    return {
      menuId: menu.id,
      roleId: role.id,
    };
  });
  return prisma.roleMenu.createMany({
    data: dataRoleMenu,
  });
}
