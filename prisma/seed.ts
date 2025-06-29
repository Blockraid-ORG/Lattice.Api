import { PrismaClient } from '@prisma/client';
import { createCategory } from './seeds/create-category';
import { createMenu } from './seeds/create-menu';
import { createPermissions } from './seeds/create-permission';
import { createRole } from './seeds/create-role';
import { createUser } from './seeds/create-user';
import { signRoleUser } from './seeds/sign-role-user';
import { signRoleMenu } from './seeds/sign-role-menu';
import { signRolePermission } from './seeds/sign-role-permissions';
import { createSocials } from './seeds/create-socials';
import { createVerifications } from './seeds/create-verifications';
import { createChains } from './seeds/create-chains';
const prisma = new PrismaClient();

async function main() {
  const chains = await createChains();
  const socials = await createSocials();
  const verifications = await createVerifications();
  const categories = await createCategory();
  const users = await createUser();
  const role = await createRole();
  const menus = await createMenu();
  const permission = await createPermissions();
  const mapRoleUser = await signRoleUser();
  const mapRoleMenu = await signRoleMenu();
  const signRolePermissions = await signRolePermission();
  console.log({
    chains,
    socials,
    verifications,
    categories,
    users,
    role,
    menus,
    permission,
    mapRoleUser,
    mapRoleMenu,
    signRolePermissions,
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
