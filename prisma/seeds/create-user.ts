import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
const prisma = new PrismaClient();
export async function createUser() {
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
