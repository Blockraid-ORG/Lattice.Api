import { PrismaClient } from '@prisma/client';
import { menus } from '../../data/menu';
const prisma = new PrismaClient();

async function createMenuRecursively(
  menu: any,
  parentId: string | null = null,
) {
  const created = await prisma.menu.create({
    data: {
      title: menu.title,
      icon: menu.icon ?? null,
      path: menu.path ?? null,
      order: menu.order ?? 0,
      isGroup: menu.isGroup ?? false,
      parentId: parentId,
    },
  });

  if (menu.children && menu.children.length > 0) {
    for (const child of menu.children) {
      await createMenuRecursively(child, created.id);
    }
  }
}

export async function createMenu() {
  for (const group of menus) {
    await createMenuRecursively(group);
  }
}
