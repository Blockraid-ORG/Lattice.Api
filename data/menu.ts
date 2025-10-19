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
        title: 'Master Payment',
        path: '/payment',
        icon: 'fluent:payment-16-filled',
        order: 2,
      },
      {
        title: 'Stable Coin',
        icon: 'streamline-ultimate:tag-dollar-bold',
        path: 'stable-coin-group',
        order: 3,
        children: [
          {
            title: 'Group',
            path: '/stable-coin-group',
            icon: 'f7:grid',
            order: 0,
          },
          {
            title: 'Stable Coin',
            path: '/stable-coin',
            icon: 'tabler:coin',
            order: 1,
          },
        ],
      },
      {
        title: 'Project Type',
        path: '/project-type',
        icon: 'fluent:group-24-filled',
        order: 4,
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
    title: 'Members',
    order: 2,
    isGroup: true,
    children: [
      {
        title: 'Project Owner',
        path: '/project-owner',
        icon: 'stash:users-crown-light',
        order: 0,
      },
      {
        title: 'Public',
        path: '/public-user',
        icon: 'lsicon:user-crowd-outline',
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
