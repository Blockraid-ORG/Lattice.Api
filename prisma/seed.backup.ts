import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { permissionData } from '../data/permissions';
const prisma = new PrismaClient();
async function createRole() {
  return await prisma.role.create({
    data: {
      name: 'SUPER',
      code: 'SUPER',
    },
  });
}
async function createUser() {
  return await prisma.user.create({
    data: {
      email: 'super@gmail.com',
      fullname: 'Super User',
      category: 'UNSIGNED',
      type: 'INTERNAL',
      password: await bcrypt.hash('super@123', 10),
    },
  });
}
async function createUserRole(userId: string, roleId: string) {
  return prisma.userRole.create({
    data: {
      roleId: roleId,
      userId: userId,
    },
  });
}
async function createPermissions() {
  return prisma.permission.createMany({
    data: permissionData,
  });
}
async function getPermissions() {
  return prisma.permission.findMany();
}
async function createRoleHeaderMenu() {
  return prisma.menu.create({
    data: {
      title: 'Super',
      isGroup: true,
    },
  });
}

async function createMenuRole(headerMenu: string) {
  return prisma.menu.create({
    data: {
      title: 'Roles',
      isGroup: false,
      icon: 'hugeicons:access',
      path: 'roles',
      parentId: headerMenu,
    },
  });
}
async function createChildRoles(parentId: string) {
  return prisma.menu.createMany({
    data: [
      {
        title: 'Roles',
        isGroup: false,
        path: '/roles',
        icon: 'oui:app-users-roles',
        order: 0,
        parentId: parentId,
      },
      {
        title: 'Permissions',
        isGroup: false,
        path: '/roles/permissions',
        icon: 'material-symbols:switch-access-2-rounded',
        order: 1,
        parentId: parentId,
      },
      {
        title: 'Users',
        isGroup: false,
        path: '/roles/users',
        icon: 'mynaui:users-group',
        order: 2,
        parentId: parentId,
      },
    ],
  });
}
async function getChildRoles() {
  return prisma.menu.findMany();
}

// TRX
// CREATE RolePermissions
async function createRolePermissions(
  data: { roleId: string; permissionId: string }[],
) {
  return prisma.rolePermission.createMany({
    data,
  });
}
// CREATE RoleMenus
async function createRoleMenu(data: { roleId: string; menuId: string }[]) {
  // console.log(data);
  return prisma.roleMenu.createMany({
    data,
    skipDuplicates: true,
  });
}
async function createMenuMenuManagement(roleId: string, parentId: string) {
  await prisma.menu.create({
    data: {
      title: 'Menu Management',
      icon: 'icon-park-outline:tree-list',
      parentId: parentId,
      isGroup: false,
      path: '/menus',
      roles: {
        create: [{ role: { connect: { id: roleId } } }],
      },
    },
  });
}
async function createCategoryProject() {
  return prisma.category.createMany({
    data: [
      {
        name: 'Private Credit',
        icon: 'fluent-emoji-high-contrast:bank',
        order: 1,
        isParent: false,
        targetYield: '8-14% IRR',
        frequency: 'MONTHLY',
        description: 'Factoring, SME loans, mezzanine debt, litigation finance',
      },
      {
        name: 'Real Estate',
        icon: 'fluent-emoji-high-contrast:houses',
        order: 2,
        targetYield: '6-10% IRR + appreciation',
        frequency: 'MONTHLY',
        isParent: false,
        description:
          'Stabilized commercial, rental- backed residential, fractional ownership',
      },
      {
        name: 'Infrastructure & ESG',
        icon: 'token:thundercore',
        order: 3,
        targetYield: '5-9% + impact',
        frequency: 'QUARTERLY',
        isParent: false,
        description:
          'Renewable energy projects, green bonds, carbon- linked yield',
      },
      {
        name: 'Royalty Streams',
        icon: 'material-symbols:music-cast',
        order: 4,
        targetYield: '10-18% variable',
        frequency: 'MONTHLY',
        isParent: false,
        description:
          'Music, film, sports, and intellectual property- backed contracts',
      },
    ],
  });
}
async function createVerifications() {
  return prisma.verification.createMany({
    data: [
      {
        name: 'KYC',
        type: 'PERSONAL',
        IDCardRequired: true,
        SelfieRequired: true,
        BussinessLicenseRequired: false,
        TaxIdRequired: false,
      },
      {
        name: 'KYB',
        type: 'CORPORATE',
        IDCardRequired: true,
        SelfieRequired: true,
        BussinessLicenseRequired: true,
        TaxIdRequired: true,
      },
    ],
  });
}
async function createMasterSocials() {
  return prisma.social.createMany({
    data: [
      {
        name: 'X',
        icon: 'ri:twitter-x-line',
      },
      {
        name: 'Discord',
        icon: 'ri:discord-fill',
      },
      {
        name: 'Instagram',
        icon: 'ri:instagram-fill',
      },
      {
        name: 'Github',
        icon: 'ri:github-fill',
      },
      {
        name: 'Website',
        icon: 'akar-icons:globe',
      },
    ],
  });
}
async function main() {
  const role = await createRole();
  const user = await createUser();
  const userRole = await createUserRole(user.id, role.id);
  await createPermissions();
  const permissions = await getPermissions();
  const headerMenu = await createRoleHeaderMenu();
  const parentMenu = await createMenuRole(headerMenu.id);
  await createChildRoles(parentMenu.id);
  const menus = await getChildRoles();
  const rolePermissionIds = permissions.map((item) => {
    return {
      roleId: role.id,
      permissionId: item.id,
    };
  });
  const rolePermissions = await createRolePermissions(rolePermissionIds);

  const menuIds = menus.map((i) => i.id);
  const allMenuIds = [...menuIds, headerMenu.id, parentMenu.id];
  const roleMenuIds = allMenuIds.map((i) => {
    return {
      roleId: role.id,
      menuId: i,
    };
  });
  const roleMenus = await createRoleMenu(roleMenuIds);
  await createMenuMenuManagement(role.id, headerMenu.id);
  await createCategoryProject();
  await createVerifications();
  await createMasterSocials();
  console.log({
    role,
    user,
    userRole,
    permissions,
    headerMenu,
    parentMenu,
    menus,
    rolePermissions,
    roleMenus,
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
