export const menus = [
  {
    title: 'Master',
    order: 0,
    isGroup: true,
    children: [
      {
        title: 'Chains',
        path: '/chain',
        icon: 'hugeicons:blockchain-05',
        order: 0,
      },
      {
        title: 'Socials',
        path: '/socials',
        icon: 'streamline-ultimate:coding-apps-website-network-globe',
        order: 1,
      },
      {
        title: 'Verification',
        path: '/verification',
        icon: 'lucide:scan-text',
        order: 2,
      },
    ],
  },
  {
    title: 'Project',
    order: 1,
    isGroup: true,
    children: [
      {
        title: 'Categories',
        path: '/category',
        icon: 'iconamoon:category-bold',
        order: 0,
      },
      {
        title: 'Projects',
        path: '/projects',
        icon: 'ix:project-arrow-diagonal-top-right',
        order: 1,
      },
    ],
  },
  {
    title: 'Utilities',
    order: 99,
    isGroup: true,
    children: [
      {
        title: 'Menu Management',
        path: '/menus',
        icon: 'clarity:tree-view-solid',
        order: 0,
      },
      {
        title: 'Roles',
        path: 'roles',
        icon: 'icon-park:setting-config',
        order: 1,
        children: [
          {
            title: 'Roles',
            path: '/roles',
            icon: 'streamline-flex:keyboard-option-setting-gear-remix',
            order: 0,
          },
          {
            title: 'Permissions',
            path: '/roles/permissions',
            icon: 'mdi:security-lock',
            order: 1,
          },
          {
            title: 'Users',
            path: '/roles/users',
            icon: 'majesticons:users-line',
            order: 2,
          },
        ],
      },
    ],
  },
];
