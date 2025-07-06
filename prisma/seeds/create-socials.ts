import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export async function createSocials() {
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
