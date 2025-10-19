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
import { createProject } from './seeds/create-project';
import { signRolePublicPermission } from './seeds/sign-role-public-permissions';
import { createProjectType } from './seeds/create-project-type';
import { createStableCoinGroup } from './seeds/create-stable-coin-group';
import { createStableCoins } from './seeds/create-stable-coin';
const prisma = new PrismaClient();

async function main() {
  const projectTypes = await createProjectType();
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
  const signRolePublicPermissions = await signRolePublicPermission();
  const stableCoinGroup = await createStableCoinGroup();
  const stableCoins = await createStableCoins(stableCoinGroup);
  await createProject();
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
    signRolePublicPermissions,
    projectTypes,
    stableCoinGroup,
    stableCoins,
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
